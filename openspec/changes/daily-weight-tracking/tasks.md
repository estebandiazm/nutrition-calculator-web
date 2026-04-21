# Tasks: daily-weight-tracking

> Dependency: Each phase depends on all prior phases being complete.

---

## Phase 1 — Foundation (types, schemas, domain models)

- [ ] 1.1 Create `src/domain/types/DailyWeight.ts` — Zod schema `DailyWeightSchema` with fields: `date` (Date, max today), `weight` (number, min 0.1, max 500, message "Weight must be between 0.1 and 500 kg"), `notes` (string optional). Export `DailyWeight` inferred type. Mirror pattern of `DailySteps.ts`. *REQ-DWT-01*

- [ ] 1.2 Update `src/domain/types/Client.ts` — add `dailyWeights?: DailyWeight[]` and `weightGoal?: number` fields to the `Client` interface. Import `DailyWeight` from `./DailyWeight`. *REQ-DWT-01, REQ-DWT-04*

- [ ] 1.3 Update `src/lib/models/Client.ts` — add `DailyWeightsSchema` sub-schema `{ date: Date required, weight: Number required min 0.1 max 500, notes: String }` with `_id: false`. Add `dailyWeights: [DailyWeightsSchema]` and `weightGoal: { type: Number }` to `ClientSchema`. Update `ClientDocument` interface to include `dailyWeights: Array<{ date: Date; weight: number; notes?: string }>` and `weightGoal?: number`. *REQ-DWT-01*

- [ ] 1.4 **[TDD - RED]** Create `src/domain/services/__tests__/weightAverageService.test.ts` — Vitest unit tests for the service that doesn't exist yet. Test cases: (a) full 7-day window returns correct average, (b) sparse week (3 of 7 days filled) fills missing days with 0 and still averages correctly over 7 slots, (c) empty array returns `{ average: 0, count: 0 }`, (d) records outside window are excluded. Tests must FAIL at this point. *REQ-DWT-03*

---

## Phase 2 — Core Logic (domain service, server actions, API endpoint)

- [ ] 2.1 **[TDD - GREEN]** Create `src/domain/services/weightAverageService.ts` — pure function `calculateWeeklyAverages(weights: DailyWeight[], weeksBack?: number): WeeklyAverage[]`. No React, no infra imports. Each `WeeklyAverage` = `{ weekLabel: string; average: number; count: number; days: { date: string; weight: number | null }[] }`. Fill algorithm: iterate day-by-day for each week, match by date string, fill `null` for missing days. Make Phase 1.4 tests pass. *REQ-DWT-03*

- [ ] 2.2 **[TDD - RED]** Write Vitest tests in `src/domain/services/__tests__/weightAverageService.test.ts` (extend existing file) — test `getWeightMetrics(weights: DailyWeight[], targetWeight?: number)`: returns `{ current, min, max, delta, progressPercent }`. Edge cases: empty array, single entry, no targetWeight (progressPercent = null). Tests must FAIL. *REQ-DWT-04*

- [ ] 2.3 **[TDD - GREEN]** Add `getWeightMetrics` export to `src/domain/services/weightAverageService.ts`. Make 2.2 tests pass. *REQ-DWT-04*

- [ ] 2.4 Update `src/app/actions/clientActions.ts` — add four weight actions following the exact same pattern as the `dailySteps` actions:
  - `addDailyWeight(clientId, date, weight, notes?)` — upsert by date (same date = update), validate with `DailyWeightSchema`, return serialized client. *REQ-DWT-01*
  - `getDailyWeightsRange(clientId, startDate, endDate)` — filter and sort descending. *REQ-DWT-02*
  - `getDailyWeightsAverage(clientId, days?)` — rolling average over N days. *REQ-DWT-04*
  - `setWeightGoal(clientId, goal)` / `getWeightGoal(clientId)` — CRUD for weight goal. *REQ-DWT-04*
  - Also update `toClient()` helper to serialize `dailyWeights` and `weightGoal`.

- [ ] 2.5 Rename API route directory: `src/app/api/clients/[clientId]/steps/` → `src/app/api/clients/[clientId]/tracking/`. Update the route file path accordingly. *REQ-UTA-01*

- [ ] 2.6 Rewrite `src/app/api/clients/[clientId]/tracking/route.ts` — single unified endpoint that dispatches on `body.type`:
  - `type: "steps"` → dispatch to `addDailyStep` (existing logic)
  - `type: "weight"` → validate with `DailyWeightSchema`, dispatch to `addDailyWeight`
  - Auth: same `validateApiKey` middleware (REQ-UTA-02)
  - Validation: return 400 with Zod error details on parse failure (REQ-UTA-03)
  - Missing `type`: return 400 `{ error: "Missing or invalid 'type' field. Expected: steps | weight" }`
  - Response shape identical for both types: `{ success, clientId, type, data: { date, <metric>, notes? } }` (REQ-UTA-01, REQ-UTA-04)

- [ ] 2.7 **[TDD - RED]** Create `src/app/api/clients/[clientId]/tracking/__tests__/route.test.ts` — integration tests using `next/server` request mocking: (a) POST with valid weight payload returns 200, (b) missing type returns 400, (c) invalid weight (600 kg) returns 400, (d) missing API key returns 401, (e) wrong API key returns 403, (f) valid steps payload still works (regression). Tests must FAIL. *REQ-UTA-01 through REQ-UTA-04*

- [ ] 2.8 **[TDD - GREEN]** Verify route.ts from 2.6 makes all tests in 2.7 pass. Fix any gaps.

---

## Phase 3 — Client UI (client-portal components)

- [ ] 3.1 Create `src/components/activity/WeightCounter.tsx` — `'use client'` component. Props: `current: number | null, goal: number | undefined`. Displays current weight vs goal in the same GlassCard + icon pattern as `src/components/dashboard/StepsCounter.tsx`. Shows `--` when no data. Shows progress bar when goal is set. *client-dashboard-ui: WeightCounter*

- [ ] 3.2 Create `src/components/activity/WeightRecentRecords.tsx` — `'use client'` component. Props: `weights: DailyWeight[], weightGoal?: number`. Same table structure as `src/components/activity/RecentRecords.tsx` but columns: Date, Weight (kg), Delta (vs previous entry), Status badge (At Goal / Above / Below). Load-more pagination (10 per page). *REQ-DWT-02, client-dashboard-ui*

- [ ] 3.3 Create `src/components/activity/WeightTrendsChart.tsx` — `'use client'` component. Props: `weights: DailyWeight[]`. Uses Recharts `LineChart` (not Bar) with week/month toggle. Calls `calculateWeeklyAverages` from `weightAverageService`. Connects dots even across sparse data by filtering nulls. Matches GlassCard visual style of `TrendsChart.tsx`. *REQ-DWT-02, REQ-DWT-03*

- [ ] 3.4 Create `src/components/client/DailyWeightModal.tsx` — `'use client'` component. Props: `open, onClose, clientId, onSuccess`. Controlled form: date (date input, default today, max today), weight (number, step 0.1, min 0.1, max 500), notes (textarea, optional). On submit: calls `addDailyWeight` server action, shows inline error or calls `onSuccess`. Mirror `DailyStepsModal.tsx` structure. *REQ-DWT-01*

- [ ] 3.5 Update `src/components/activity/ActivityPageClient.tsx` — add weight tracking tab/section alongside steps. Import and render `WeightCounter`, `WeightTrendsChart`, `WeightRecentRecords`, `DailyWeightModal`. Add "+ Add Weight" button that opens the modal. Pass `dailyWeights` and `weightGoal` as new props. Keep steps section untouched. *client-dashboard-ui*

- [ ] 3.6 Update `src/app/(client-portal)/activity/page.tsx` — fetch `dailyWeights` and `weightGoal` from `clientRecord`, pass as new props to `ActivityPageClient`. No other changes.

- [ ] 3.7 Update `src/app/(client-portal)/dashboard/page.tsx` — replace or supplement `StepsCounter` widget with `WeightCounter`. Import `WeightCounter` from `@/components/activity/WeightCounter`. Pass `current` as last weight entry value, `goal` as `clientRecord.weightGoal`. *client-dashboard-ui: WeightCounter*

---

## Phase 4 — Coach Features (coach dashboard components)

- [ ] 4.1 Create `src/components/coach/WeightGoalEditor.tsx` — `'use client'` component. Props: `clientId, currentGoal?: number, onSuccess?`. Number input + Save button. Calls `setWeightGoal` server action. Inline error/success feedback. Mirror exact UI of `src/components/coach/StepGoalEditor.tsx` but for weight (kg label, decimal step 0.1). *REQ-DWT-04*

- [ ] 4.2 Update `src/app/(dashboard)/clients/[clientId]/page.tsx` — add Weight section below the existing Step Goal section:
  - Import `WeightGoalEditor` and render with `clientId`, `currentGoal={client.weightGoal}`
  - Import and render `WeightTrendsChart` with `client.dailyWeights`
  - Import and render `WeightRecentRecords` with `client.dailyWeights` and `client.weightGoal`
  - Fetch `dailyWeights` and `weightGoal` from `getClientById` result (already available after Phase 2.4 serialization fix)
  - Keep all existing steps sections untouched.

---

## Phase 5 — Testing (E2E)

- [ ] 5.1 **[TDD - RED]** Create `tests/weight-tracking-client.spec.ts` (Playwright) — E2E for client portal:
  - Test: client can open "+ Add Weight" modal from activity page
  - Test: submitting valid weight (75 kg) closes modal and new record appears in `WeightRecentRecords` table
  - Test: submitting weight > 500 shows validation error in modal (stays open)
  - Test: `WeightCounter` on dashboard shows updated weight after entry
  Use Page Object pattern matching existing Playwright test structure in `tests/`. *REQ-DWT-01, REQ-DWT-02*

- [ ] 5.2 **[TDD - RED]** Create `tests/weight-tracking-coach.spec.ts` (Playwright) — E2E for coach portal:
  - Test: coach can view client weight history in client detail page
  - Test: coach can set weight goal for a client via `WeightGoalEditor` and see success feedback
  - Test: `WeightRecentRecords` table shows correct status badge (At Goal / Above / Below)
  *REQ-DWT-02, REQ-DWT-04*

- [ ] 5.3 **[TDD - RED]** Create `tests/tracking-api.spec.ts` (Playwright API test or standalone) — E2E for unified tracking endpoint:
  - Test: `POST /api/clients/:id/tracking` with `type: "weight"` and valid payload returns 200
  - Test: `POST /api/clients/:id/tracking` with `type: "steps"` still works (regression)
  - Test: endpoint with missing `type` returns 400 with descriptive error
  - Test: old `steps/` path returns 404 (verify rename completed)
  *REQ-UTA-01, REQ-UTA-02, REQ-UTA-03, REQ-UTA-04*

- [ ] 5.4 **[TDD - GREEN]** Run all Playwright tests (`yarn playwright test`) and fix any failures. All 5.1–5.3 tests must pass before marking Phase 5 complete.

---

## Dependency Summary

```
Phase 1 (types + domain model)
  └─► Phase 2 (service + actions + API)
        └─► Phase 3 (client UI)
              └─► Phase 4 (coach UI)
                    └─► Phase 5 (E2E)
```

Unit tests in Phases 1 and 2 follow strict TDD (RED first, then GREEN in-phase). E2E tests in Phase 5 are written RED before Phase 5 GREEN closes everything.
