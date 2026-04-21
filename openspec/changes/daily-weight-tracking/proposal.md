# Proposal: Daily Weight Tracking

## Intent

Give clients a way to log daily weight and let coaches set a target weight per client, mirroring the existing daily steps flow. This closes the mocked "Weight progress" column in the coach dashboard and extends the client portal with meaningful trend visibility. It also consolidates daily biometric ingestion behind a single endpoint so future metrics (sleep, heart rate) slot in cleanly.

## Scope

### In Scope
- Weight logging UI on client portal (modal + counter widget on `/dashboard`, history on `/activity`)
- Target weight editor on coach's client detail view + weight trends chart
- Unified tracking endpoint: rename `POST /api/clients/[clientId]/steps` -> `/tracking` accepting `{ date, steps?, weight? }`
- New Zod schemas `DailyWeight` and `TrackingEntry`
- Mongoose subdocument `dailyWeights` on Client (parallel to existing `dailySteps`)
- Domain service `weightAverageService.ts` with "fill-with-0 if no weight that day" weekly average logic
- Server Actions for weight CRUD + target weight update
- E2E coverage for log/edit/delete weight, target update, weekly average

### Out of Scope
- Body composition metrics (body fat %, muscle mass)
- Goal-based notifications / coach alerts on weight drift
- Historical import of weight data from external devices
- Changing existing `dailySteps` data shape

## Capabilities

### New Capabilities
- **`daily-weight-tracking`**: clients log daily weight; coaches set target weight and view trends; weekly averages computed with fill-with-0 for missing days
- **`unified-tracking-api`**: single `POST /api/clients/[clientId]/tracking` endpoint validating `TrackingEntrySchema` for any combination of steps and weight (supersedes the current `/steps` endpoint)

### Modified Capabilities
- **`client-dashboard-ui`**: add WeightCounter widget next to StepsCounter; activity page gains weight history section with its own TrendsChart variant (uses `null` for missing days, not `0`)

## Approach (Option B from exploration)

Parallel data arrays on the `Client` document: `dailySteps: [...]` and `dailyWeights: [{ date, weight, notes? }]`. `targetWeight` scalar already exists on Client. A unified endpoint accepts a `TrackingEntry` Zod-validated body and upserts into one or both arrays by `date` key. Weight weekly average uses a pure domain service so the fill rule stays testable and independent of Mongoose.

## Affected Areas

- `src/domain/types/DailyWeight.ts` — NEW Zod schema
- `src/domain/types/TrackingEntry.ts` — NEW unified request schema
- `src/domain/services/weightAverageService.ts` — NEW fill-with-0 logic
- `src/lib/models/Client.ts` — add `dailyWeights` subdocument + keep existing `dailySteps`
- `src/app/api/clients/[clientId]/steps/route.ts` — delete after rename to `/tracking`
- `src/app/api/clients/[clientId]/tracking/route.ts` — NEW, validates `TrackingEntrySchema`
- `src/app/actions/clientActions.ts` — add `logDailyWeight`, `updateDailyWeight`, `deleteDailyWeight`, `updateTargetWeight`
- `src/components/client/DailyWeightModal.tsx` — NEW (mirror of `DailyStepsModal`)
- `src/components/dashboard/WeightCounter.tsx` — NEW (mirror of `StepsCounter`)
- `src/app/(client-portal)/dashboard/page.tsx` — mount WeightCounter
- `src/app/(client-portal)/activity/page.tsx` — weight history + trends chart
- `src/app/(dashboard)/clients/[clientId]/page.tsx` — target weight editor + chart

## Risks

| Risk | Mitigation |
|------|------------|
| `/steps` endpoint rename breaks external callers | No production consumers yet; ship rename with change. Add deprecation comment if needed. |
| First-time user has no prior weight for "fill" logic | Service returns `null` (not 0) when array is empty; UI shows "No data yet". Fill-with-0 applies only to gaps inside an existing series. |
| TrendsChart shared component may regress steps chart | Extend component with `missingValueBehavior: 'zero' \| 'null'` prop; default preserves steps behavior. |
| Mongoose validation silently accepts future dates | Reuse `DailyStepSchema` date constraint (`z.date().max(new Date())`) in `DailyWeightSchema`. |

## Rollback Plan

1. Remove `dailyWeights` field from `Client` Mongoose schema (existing docs tolerate extra field)
2. Restore `src/app/api/clients/[clientId]/steps/route.ts`, delete `/tracking/route.ts`
3. Drop weight Server Actions and UI components
4. Revert `client-dashboard-ui` spec changes
5. Keep `weightAverageService.ts` (pure, inert)

## Success Criteria

- [ ] Client logs, edits, and deletes daily weight via `/dashboard` and `/activity`
- [ ] Coach sets target weight and sees weight history + weekly averages per client
- [ ] `POST /api/clients/[clientId]/tracking` accepts `steps`-only, `weight`-only, or both
- [ ] Weekly weight average fills missing days with 0 (matches existing steps behavior)
- [ ] Weight TrendsChart shows gaps (null) rather than zeros
- [ ] Playwright covers: log weight, edit weight, delete weight, update target, view history
