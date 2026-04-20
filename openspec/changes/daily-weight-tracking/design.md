# Design: Daily Weight Tracking

## Architecture Overview

```
                ┌──────────────────────────────┐
                │       Client Portal UI        │
                │  /dashboard   /activity       │
                └──────────────┬───────────────┘
                               │
           ┌───────────────────┼────────────────────┐
           ▼                   ▼                    ▼
   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
   │ DailyWeight    │  │ WeightCounter  │  │ WeightTrends   │
   │ Modal          │  │ (dashboard)    │  │ Chart +        │
   │ (log entry)    │  │                │  │ WeightRecent   │
   └───────┬────────┘  └────────────────┘  │ Records        │
           │                                └────────────────┘
           ▼
   ┌──────────────────────────┐
   │  Server Actions           │
   │  addDailyWeight()         │
   │  getDailyWeights()        │
   │  getWeeklyAverage()       │
   │  setTargetWeight()        │
   └────────┬─────────────────┘
            │
            ├──────► weightAverageService (pure, domain)
            │        fill gaps with 0, compute weekly avg
            │        return null when span is empty
            │
            ▼
   ┌──────────────────────────┐
   │  ClientModel (Mongoose)   │
   │  dailyWeights: [...]      │  (parallel to dailySteps)
   │  targetWeight: number     │  (already exists)
   └──────────────────────────┘

            ▲
            │
   ┌────────┴─────────────────┐
   │  POST /api/.../tracking   │  (supersedes /steps)
   │  body: {date, steps?,     │
   │         weight?}          │
   │  dispatches to both       │
   │  addDailyStep and/or      │
   │  addDailyWeight           │
   └──────────────────────────┘
```

---

## 1. Schema Strategy

### Decision: Parallel arrays on Client document

`Client` will carry two independent subdocument arrays:

```
Client {
  ...existing fields
  dailySteps:   [{ date, steps,  notes? }]   // already exists
  dailyWeights: [{ date, weight, notes? }]   // NEW
  stepGoal?:     number                       // already exists
  targetWeight?: number                       // already exists (scalar)
}
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A. Unified `trackingEntries` array** with `{ date, steps?, weight? }` | Single source of truth; one query | Type narrowing complexity in consumers; breaks existing `dailySteps` shape; migration required | Rejected |
| **B. Parallel arrays `dailySteps` + `dailyWeights`** | Mirrors existing pattern; zero migration on existing data; trivial queries; independent evolution | Two array scans on the Client doc for combined views (negligible cost — embedded subdocs) | **CHOSEN** |
| **C. Separate top-level collection `DailyTracking`** | Independent lifecycle; scalable | Overkill for embedded per-client data; extra lookups; breaks current embedding pattern | Rejected |

### Rationale

Mirroring the existing `dailySteps` pattern keeps the schema shape predictable and avoids any migration on live data. Queries stay simple: `client.dailyWeights.filter(...)` is the exact same ergonomic as `client.dailySteps.filter(...)`. We get feature symmetry for free.

---

## 2. Fill Algorithm — `weightAverageService`

### Decision: Pure domain service

**New file**: `src/domain/services/weightAverageService.ts`

This module is PURE TypeScript — no Mongoose, no React, no side effects. Input is an array of `DailyWeight` entries; output is a number or null.

### Alternatives Considered

| Option | Verdict |
|--------|---------|
| Inline in Server Action `getWeeklyAverage` | Rejected — not unit-testable without DB |
| Mongoose pre-save / virtual | Rejected — couples domain logic to infra; hard to test; runs at wrong lifecycle |
| **Pure domain service** | **CHOSEN** — testable, reusable, deterministic |

### API Surface

```typescript
// src/domain/services/weightAverageService.ts
import { DailyWeight } from '../types/DailyWeight';

export interface WeeklyAverageOptions {
  /** Reference "today" — defaults to new Date(); injectable for tests. */
  now?: Date;
  /** Number of days in the window. Defaults to 7. */
  windowDays?: number;
}

/**
 * Compute the weekly average weight for a range.
 *
 * Behavior:
 *  - Entries outside the window are ignored.
 *  - Missing days INSIDE the window are filled with 0 (same semantics as steps weekly average).
 *  - If the window contains NO entries at all, returns `null` — "no data yet".
 *  - If the window contains at least one entry, missing days contribute 0 to the mean
 *    (mirrors the existing steps behavior for consistency).
 */
export function getWeightWeeklyAverage(
  entries: DailyWeight[],
  options?: WeeklyAverageOptions,
): number | null;

/**
 * Fill a date range with entries, inserting placeholders for missing days.
 * Used by the chart to render gaps explicitly as `null` (not 0).
 */
export function fillWeightSeries(
  entries: DailyWeight[],
  startDate: Date,
  endDate: Date,
): Array<{ date: Date; weight: number | null }>;
```

### Fill Semantics Summary

| Context | Missing-day behavior | Empty-window behavior |
|---------|---------------------|----------------------|
| `getWeightWeeklyAverage` | Fill with 0, contribute to mean | Return `null` |
| `fillWeightSeries` (chart) | Fill with `null` (gap) | Returns array of all-null slots |
| Steps analog (existing) | Fill with 0 | Returns `{ average: 0, count: 0 }` |

The divergence is intentional: the weekly *average* mirrors steps semantics so coaches get comparable metrics; the *chart* shows gaps as null to avoid misleading zero bars (a missing weight is not a zero weight).

---

## 3. API Endpoint — `/steps` → `/tracking`

### Decision: Rename and accept both types

| Current | Proposed |
|---------|----------|
| `POST /api/clients/[clientId]/steps`<br/>body: `{ date, steps, notes? }` | `POST /api/clients/[clientId]/tracking`<br/>body: `{ date, steps?, weight?, notes? }` |

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Keep `/steps`, add `/weight` | Minimal surface change | Two network calls for devices reporting both; inconsistent contract | Rejected |
| **Rename `/steps` → `/tracking`, unified body** | One call for external devices; one contract; future-proof for sleep/heart-rate | File rename; refactor existing callers | **CHOSEN** |
| `/tracking` delegates to `/steps` and `/weight` | Clean separation | Extra internal hops; two auth checks; not in prod yet so no need | Rejected |

### Rationale

No production consumers yet. Single call reduces round-trips for external devices (fitness trackers, scales) that may report both metrics. `TrackingEntrySchema` enforces that at least one metric is present via Zod `.refine()`.

### Dispatch Logic

```typescript
// Inside POST handler
const parsed = TrackingEntrySchema.safeParse(body);
if (!parsed.success) return 400;

const { date, steps, weight, notes } = parsed.data;

const result: { steps?: number; weight?: number } = {};

if (steps !== undefined) {
  await addDailyStep(clientId, date, steps, notes);
  result.steps = steps;
}

if (weight !== undefined) {
  await addDailyWeight(clientId, date, weight, notes);
  result.weight = weight;
}

return NextResponse.json({
  success: true,
  clientId,
  entry: { date: date.toISOString().split('T')[0], ...result },
});
```

Auth remains the same X-API-Key header validation via `validateApiKey(clientId, apiKey)`.

---

## 4. Chart Component — `WeightTrendsChart`

### Decision: Separate component (not a reuse of `TrendsChart`)

**New file**: `src/components/activity/WeightTrendsChart.tsx`

### Alternatives Considered

| Option | Verdict |
|--------|---------|
| Generic `TrendsChart` with `missingValueBehavior: 'zero' \| 'null'` prop | Rejected — introduces conditional rendering, Recharts handling of `null` vs 0 differs, harder to maintain |
| **Separate `WeightTrendsChart`** | **CHOSEN** — explicit, safer, clearer ownership |

### Rationale

Weight and steps have DIFFERENT fill semantics at the UI layer:

- **Steps** render 0 for missing days — a missing step count legitimately means "didn't walk".
- **Weight** renders `null` (gap) — a missing weight entry does NOT mean the client weighs 0; it means they didn't log.

Duplicating a small Recharts wrapper is cheaper than trying to make a config-driven chart handle both semantics cleanly. If future metrics (sleep, HR) emerge, we re-evaluate extraction — don't abstract prematurely.

Component signature:

```typescript
interface WeightTrendsChartProps {
  weights: DailyWeight[];
  targetWeight?: number; // horizontal reference line
}
```

Uses the same visual language (`GlassCard`, pink accent, Week/Month toggle) as `TrendsChart`, but:
- Renders a LineChart rather than BarChart (continuous metric, not count)
- Draws a dashed horizontal `ReferenceLine` at `targetWeight` when present
- Uses `connectNulls={false}` so gaps render as broken line segments

---

## 5. First-Week Empty State

### Decision: Return `null`, render "No data yet"

When a client has zero weight entries in the requested window:

- `getWeightWeeklyAverage` returns `null`
- UI shows "No data yet — log your first weight to see your trend"
- Chart renders empty grid with target-weight reference line (if set)

### Alternatives Considered

| Option | Verdict |
|--------|---------|
| Return 0 | Rejected — misleading (client did not weigh 0) |
| Return last known value ever (outside window) | Rejected — contradicts "weekly" semantics; hides reality |
| **Return null** | **CHOSEN** — honest, safe UX |

Spec alignment: "first week with no entries = null (don't mislead user with fake data)".

---

## 6. File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/domain/types/DailyWeight.ts` | Zod schema + type (mirrors `DailySteps.ts`) |
| `src/domain/types/TrackingEntry.ts` | Zod schema for unified endpoint body |
| `src/domain/services/weightAverageService.ts` | Pure fill + average calculation |
| `src/app/api/clients/[clientId]/tracking/route.ts` | Unified POST handler; replaces `/steps` |
| `src/components/client/DailyWeightModal.tsx` | Modal for log/edit weight entry |
| `src/components/dashboard/WeightCounter.tsx` | Dashboard widget: current + target weight |
| `src/components/activity/WeightTrendsChart.tsx` | LineChart with gap rendering + target reference |
| `src/components/activity/WeightRecentRecords.tsx` | Table of recent weight entries |
| `src/components/coach/WeightGoalEditor.tsx` | Coach-side target weight editor |

### Modified Files

| File | Change |
|------|--------|
| `src/lib/models/Client.ts` | Add `DailyWeightsSchema` subdoc + `dailyWeights` field on `ClientDocument` and `ClientSchema` |
| `src/domain/types/Client.ts` | Add `dailyWeights?: DailyWeight[]` to `Client` interface |
| `src/app/actions/clientActions.ts` | Add `addDailyWeight`, `updateDailyWeight`, `deleteDailyWeight`, `getDailyWeightsRange`, `getWeightWeeklyAverage`, `setTargetWeight`; update `toClient` serializer to include `dailyWeights` |
| `src/app/(client-portal)/dashboard/page.tsx` | Import and render `<WeightCounter />` next to `<StepsCounter />` |
| `src/app/(client-portal)/activity/page.tsx` | Add weight section with `<WeightTrendsChart />` + `<WeightRecentRecords />` |
| `src/app/(dashboard)/clients/[clientId]/page.tsx` | Mount `<WeightGoalEditor />` + weight history view for coach |

### Deleted Files

| File | Reason |
|------|--------|
| `src/app/api/clients/[clientId]/steps/route.ts` | Superseded by `/tracking/route.ts` |

---

## 7. Data Structures

### `DailyWeight` Zod Schema

```typescript
// src/domain/types/DailyWeight.ts
import { z } from 'zod';

export const DailyWeightSchema = z.object({
  date: z.date().max(new Date(), { message: 'Date cannot be in the future' }),
  weight: z
    .number()
    .min(0.1, { message: 'Weight must be greater than 0' })
    .max(500, { message: 'Weight cannot exceed 500 kg' }),
  notes: z.string().optional(),
});

export type DailyWeight = z.infer<typeof DailyWeightSchema>;
```

### `TrackingEntry` Zod Schema

```typescript
// src/domain/types/TrackingEntry.ts
import { z } from 'zod';

export const TrackingEntrySchema = z
  .object({
    date: z.coerce.date().max(new Date(), {
      message: 'Date cannot be in the future',
    }),
    steps: z
      .number()
      .int()
      .min(0)
      .max(100000)
      .optional(),
    weight: z.number().min(0.1).max(500).optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.steps !== undefined || data.weight !== undefined, {
    message: 'At least one of `steps` or `weight` must be provided',
  });

export type TrackingEntry = z.infer<typeof TrackingEntrySchema>;
```

### Mongoose Subdocument

```typescript
// Inside src/lib/models/Client.ts
const DailyWeightsSchema = new Schema(
  {
    date: { type: Date, required: true },
    weight: { type: Number, required: true, min: 0.1, max: 500 },
    notes: { type: String },
  },
  { _id: false },
);

// On ClientSchema:
dailyWeights: [DailyWeightsSchema],
```

And on `ClientDocument`:

```typescript
dailyWeights: Array<{ date: Date; weight: number; notes?: string }>;
```

### API Response Shape

```typescript
// POST /api/clients/[clientId]/tracking — success
{
  success: true,
  clientId: "6421abc...",
  entry: {
    date: "2026-04-19",       // YYYY-MM-DD
    steps?: 8421,              // present only if provided
    weight?: 80.5,             // present only if provided
    notes?: "Morning run"      // present only if provided
  }
}

// Error — 400
{ error: "Validation failed: ..." }

// Auth failure — 401 / 403
{ error: "Missing X-API-Key header" }
{ error: "Invalid or mismatched API key" }
```

---

## 8. Data Flow

### Flow 1: Client logs weight via modal (dashboard)

```
User clicks "Log Weight" on /dashboard
  │
  ├─ <DailyWeightModal /> opens (client component)
  │   └─ form: { date (default today), weight, notes? }
  │
  ├─ Submit → Server Action addDailyWeight(clientId, date, weight, notes)
  │   ├─ DailyWeightSchema.safeParse() — client-side + server-side validation
  │   ├─ normalizedDate.setHours(0,0,0,0)  // date-key upsert
  │   ├─ ClientModel.findById(clientId)
  │   ├─ existing entry for that date? → replace
  │   │  else → push
  │   └─ doc.save()
  │
  └─ Modal closes; WeightCounter re-renders with new value
      (revalidatePath('/dashboard') + '/activity')
```

### Flow 2: Coach views weight history on client detail

```
GET /clients/[clientId] (Server Component)
  │
  ├─ getClientById(clientId)  // existing
  ├─ client.dailyWeights    // embedded — no extra query
  ├─ getWeightWeeklyAverage(client.dailyWeights)  // domain service
  │
  └─ Renders:
      <WeightGoalEditor clientId={...} current={client.targetWeight} />
      <WeightTrendsChart weights={client.dailyWeights} targetWeight={...} />
      <WeightRecentRecords weights={client.dailyWeights} targetWeight={...} />
```

### Flow 3: External device POSTs unified tracking

```
POST /api/clients/[clientId]/tracking
Headers: X-API-Key: <client-api-key>
Body: { "date": "2026-04-19", "steps": 8421, "weight": 80.3 }
  │
  ├─ validateApiKey(clientId, apiKey)         // existing helper
  ├─ TrackingEntrySchema.safeParse(body)
  ├─ if (steps) → addDailyStep(...)
  ├─ if (weight) → addDailyWeight(...)
  │
  └─ 200 { success: true, entry: { date, steps, weight } }
```

---

## 9. Server Actions — New signatures

**File**: `src/app/actions/clientActions.ts`

```typescript
// ─── Daily Weight ──────────────────────────────────────────────────────────

export async function addDailyWeight(
  clientId: string,
  date: Date,
  weight: number,
  notes?: string,
): Promise<(Client & { id: string }) | null>;

export async function getDailyWeightsRange(
  clientId: string,
  startDate: Date,
  endDate: Date,
): Promise<DailyWeight[]>;

export async function getWeightWeeklyAverage(
  clientId: string,
  days?: number, // default 7
): Promise<{ average: number | null; count: number }>;

export async function deleteDailyWeight(
  clientId: string,
  date: Date,
): Promise<(Client & { id: string }) | null>;

// ─── Target Weight ─────────────────────────────────────────────────────────

export async function setTargetWeight(
  clientId: string,
  target: number,
): Promise<(Client & { id: string }) | null>;

export async function getTargetWeight(
  clientId: string,
): Promise<number | null>;
```

`addDailyWeight` follows the `addDailyStep` upsert-by-date-key pattern exactly (find index by `toDateString()`, replace or push, `doc.save()`).

`toClient` serializer extended to include `dailyWeights: plain.dailyWeights ?? []`.

---

## 10. Testing Strategy

| Layer | Target | Approach |
|-------|--------|----------|
| **Unit** | `weightAverageService.getWeightWeeklyAverage` | Vitest: empty array → null, partial week → fill with 0, all days present → simple mean, entries outside window ignored, injected `now` for determinism |
| **Unit** | `weightAverageService.fillWeightSeries` | Vitest: gaps emit `null`, chronological ordering, boundary dates included |
| **Unit** | `DailyWeightSchema`, `TrackingEntrySchema` | Vitest: future dates rejected, negative weight rejected, `TrackingEntry` with neither steps nor weight rejected |
| **Integration** | `addDailyWeight` upsert | Test DB: two logs same date → replace; two logs different dates → both exist |
| **Integration** | `POST /api/clients/[clientId]/tracking` dispatch | Mock DB: steps-only, weight-only, both; validates 400 on missing key, 403 on wrong key |
| **E2E (Playwright)** | Client log weight from `/dashboard` | Open modal, submit, assert WeightCounter updates |
| **E2E** | Client view history on `/activity` | Navigate, assert chart renders + WeightRecentRecords table populated |
| **E2E** | Coach set target on client detail | Edit target via WeightGoalEditor, assert saved + reference line rendered |
| **E2E** | Coach sees only their clients' weights | Two coaches, assert isolation (reuses existing data-access boundary) |

Vitest is not yet configured in the repo — `weightAverageService` will be the first target for it. Until then, apply-phase may ship Playwright coverage and a TODO to wire Vitest.

---

## 11. Migration & Rollout

### Data Migration

**None required.** `dailyWeights` is a new field on existing `Client` docs. MongoDB tolerates missing fields — reads return `undefined`; first `addDailyWeight` call initializes the array. No backfill needed.

### Endpoint Transition

The `/steps` endpoint is renamed to `/tracking`. Since there are no production consumers:

- **Chosen path**: hard rename. Delete `/steps/route.ts`, add `/tracking/route.ts`.
- **If there were prod consumers**: we would keep `/steps` for one release with a deprecation header (`X-Deprecated: use /tracking`), then remove.

### Feature Flags

Not required. The new UI components are additive on `/dashboard` and `/activity`. If the weekly average service misbehaves, the fallback is to hide the widget (`null` handling already covers this).

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Weight chart renders misleading zero bars for missing days | Coach misreads data | `WeightTrendsChart` uses `connectNulls={false}` and `fillWeightSeries` returns `null` for gaps — gaps are visible as broken line segments, not zero bars |
| `TrackingEntrySchema` allows empty body (no steps, no weight) | Noise in DB; confusing 200 responses | Zod `.refine()` rejects bodies missing both fields — 400 returned |
| `addDailyWeight` race: two concurrent requests for the same date | Double-push, two entries for the same day | Upsert-by-date-key pattern (find-by-toDateString, replace-in-place) matches steps pattern; final write wins. Acceptable for this domain — single user, low concurrency |
| External devices send weight with high precision (e.g. 80.345) | DB stores floats; display inconsistency | Do NOT round server-side (preserve source truth). Round in UI via `toFixed(1)` |
| Client ships with no target weight | WeightCounter has nothing to compare against | Render "Set a target with your coach" placeholder; chart omits reference line |
| Pre-existing clients lack `dailyWeights` array | Mongoose `undefined` access in chart | `toClient` serializer defaults to `[]`; components guard `weights.length === 0` |
| `/steps` endpoint removed but a stale caller still exists | 404 on external device POST | Grep repo + docs for `/api/clients/.../steps` usages; update `AGENTS.md` / README if referenced; no external consumers in prod yet |
| Mongoose `dailyWeights` subdocs lack `_id` (by design) — can't target via subdocument ID | Delete/update must use date-key lookup | Consistent with `dailySteps` pattern; actions use date-normalized lookup |

---

## 13. Open Questions

- [ ] **WeightGoalEditor history**: Should the coach dashboard record a history of target-weight changes (audit trail) or only the current scalar? Spec treats `targetWeight` as a scalar. MVP assumes scalar; history can be added later by converting `targetWeight: number` → `targetWeightHistory: [{ value, setAt }]`.
- [ ] **Future-date UX**: Spec rejects future dates. What's the exact error message shown in the `DailyWeightModal` — "Cannot log future weights" or reuse Zod's "Date cannot be in the future"? Recommend matching the steps-modal copy for consistency.
- [ ] **Last-weigh-in display**: The `WeightCounter` widget could show "Last logged: 3 days ago" to prompt laggers. Not in spec; useful UX; add if cheap during apply phase, otherwise defer.
- [ ] **Unit system**: Kg assumed throughout (schema max 500). If/when lb support is needed, introduce a `weightUnit` per-client preference. Not in scope.

---

## 14. Implementation Notes

- `addDailyStep` (lines 118–149 of `clientActions.ts`) is the exact reference pattern for `addDailyWeight`. Copy structure; swap field name and validation schema.
- `toClient` serializer (lines 18–31) must include `dailyWeights: plain.dailyWeights ?? []`. Forgetting this will silently strip data at the Server → Client boundary.
- The existing `/steps` route handler (86 lines) is the structural template for `/tracking/route.ts`. Swap `DailyStepSchema` → `TrackingEntrySchema`, add the dispatch block, keep auth flow identical.
- `TrendsChart` (activity/TrendsChart.tsx) uses `BarChart` + `Bar`. `WeightTrendsChart` should use `LineChart` + `Line` + optional `ReferenceLine` for the target, importing the same `GlassCard` wrapper + Tailwind classes for visual parity.
- No new infra dependencies — Recharts already installed (`TrendsChart` uses it); Zod already in use; Mongoose subdocument pattern already proven by `dailySteps`.
