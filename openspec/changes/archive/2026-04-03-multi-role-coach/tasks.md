# Tasks: Multi-Role Coach Rename & Unified Login

## Phase 1: Domain Layer

- [ ] TASK-01: Rename `src/domain/types/Nutritionist.ts` → `src/domain/types/Coach.ts`
  - Rename interface `Nutritionist` → `Coach`
  - Field `authId?: string` already present — keep as-is
  - Delete original file after renaming
- [ ] TASK-02: Update `src/domain/types/Client.ts`
  - Rename field `nutritionistId: string` → `coachId: string`
  - Update the `Omit<>` usage in any type helpers in this file if present

## Phase 2: Infrastructure Layer

- [ ] TASK-03: Rename `src/lib/models/Nutritionist.ts` → `src/lib/models/Coach.ts`
  - Update import: `import { Coach as ICoach } from '../../domain/types/Coach'`
  - Rename interface `NutritionistDocument` → `CoachDocument` (extends `ICoach`)
  - Rename schema variable `NutritionistSchema` → `CoachSchema`
  - Add field to schema: `authId: { type: String, sparse: true, index: true, unique: true }`
  - Add `collection: 'coaches'` to schema options (alongside `timestamps`, `toJSON`, `toObject`)
  - Update model registration: `mongoose.models.Coach || mongoose.model<CoachDocument>('Coach', CoachSchema)`
  - Rename export `NutritionistModel` → `CoachModel`
  - Delete original `Nutritionist.ts` file
- [ ] TASK-04: Update `src/lib/models/Client.ts`
  - In `ClientDocument` interface: rename `nutritionistId` → `coachId` in the `Omit<>` list and as a field declaration
  - In `ClientSchema`: rename field `nutritionistId` → `coachId`, update `ref: 'Nutritionist'` → `ref: 'Coach'`

## Phase 3: Server Actions

- [ ] TASK-05: Rename `src/app/actions/nutritionistActions.ts` → `src/app/actions/coachActions.ts`
  - Update all imports to use `CoachModel`, `CoachDocument` from `../../lib/models/Coach`
  - Update domain type import to `Coach` from `../../domain/types/Coach`
  - Rename internal mapper `toNutritionist` → `toCoach`, update return type to `Coach & { id: string }` (include `authId` in the returned object)
  - Rename export `createNutritionist` → `createCoach`
  - Rename export `getNutritionistById` → `getCoachById`
  - Rename export `getNutritionists` → `getCoaches`
  - Add new export `getCoachByAuthId(authId: string): Promise<(Coach & { id: string }) | null>` — calls `CoachModel.findOne({ authId })`
  - Delete original `nutritionistActions.ts` file
- [ ] TASK-06: Update `src/app/actions/clientActions.ts`
  - Rename function `getClientsByNutritionistId` → `getClientsByCoachId`
  - Update all internal references to `nutritionistId` field → `coachId`
  - Update parameter names from `nutritionistId` → `coachId`
- [ ] TASK-07: Update `src/app/(dashboard)/clients/new/actions.ts`
  - Rename variable `defaultNutritionistId` → `defaultCoachId`
  - Update env var reference: `process.env.NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` → `process.env.NEXT_PUBLIC_DEFAULT_COACH_ID`
  - Update import from `nutritionistActions` → `coachActions` if this file imports from it

## Phase 4: Auth Layer

- [ ] TASK-08: Update `src/infrastructure/ports/AuthProvider.ts`
  - Change `Role` type: `'nutritionist' | 'client'` → `'coach' | 'client'`
- [ ] TASK-09: Update `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts`
  - Replace role guard: `rawRole === 'nutritionist'` → `rawRole === 'coach'`
  - Full expression: `(rawRole === 'coach' || rawRole === 'client') ? rawRole : 'client'`
- [ ] TASK-10: Update `src/middleware.ts`
  - Line 39: `role === 'nutritionist'` → `role === 'coach'`
  - Line 49: `role === 'nutritionist'` → `role === 'coach'`
  - Line 63: `role === 'nutritionist'` → `role === 'coach'`
  - Line 63 comment: "Prevent nutritionists from accessing client portal" → "Prevent coaches from accessing client portal"
- [ ] TASK-11: Update `src/app/(auth)/login/actions.ts`
  - In `getRedirectUrl`: `role === 'nutritionist'` → `role === 'coach'`

## Phase 5: Components & Imports

- [ ] TASK-12: Update `src/components/creator/SavePlanModal.tsx`
  - Rename prop `nutritionistId` → `coachId` in the component's props interface
  - Update all usages of that prop inside the component
  - Update import from `nutritionistActions` → `coachActions` if present
- [ ] TASK-13: Update `src/components/creator/Creator.tsx`
  - Rename all `nutritionistId` variable/prop usages → `coachId`
  - Update env var reference: `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` → `NEXT_PUBLIC_DEFAULT_COACH_ID`
  - Update import from `nutritionistActions` → `coachActions` if present
- [ ] TASK-14: Update `src/context/ClientContext.tsx`
  - In the default client object: rename key `nutritionistId` → `coachId`
  - Update any type annotation referencing the `nutritionistId` field
- [ ] TASK-15: Grep audit — find any remaining references not covered by the above tasks
  - Run: `rg -in 'nutritionist' src/` — must return 0 results (excluding the migration script)
  - Run: `rg -in 'nutritionist' scripts/` — only the migration script should match
  - Run: `rg -in 'NUTRITIONIST' .env*` — must return 0 results
  - Fix any found occurrences before proceeding to Phase 6
- [ ] TASK-16: Update `src/lib/registry.ts`
  - If it imports from `NutritionistModel` or references `'Nutritionist'` string, update to `CoachModel` / `'Coach'`

## Phase 6: Environment & Seed Scripts

- [ ] TASK-17: Update `.env.local`
  - Rename key `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` → `NEXT_PUBLIC_DEFAULT_COACH_ID`
  - Update any other env files (`.env.example`, `.env.production`, etc.) if they exist
- [ ] TASK-18: Rename `scripts/seed-nutritionist.ts` → `scripts/seed-coach.ts`
  - Update all internal imports to use `CoachModel` from `../src/lib/models/Coach`
  - Rename any internal variables referencing `nutritionist` → `coach`

## Phase 7: Migration Script

- [ ] TASK-19: Create `scripts/migrate-nutritionist-to-coach.ts`
  - Step 1: Connect to MongoDB via `dbConnect()`
  - Step 2: Count documents in `nutritionists` collection; log count
  - Step 3: **Idempotent guard** — if `coaches` collection already has documents, skip copy and log; else insert all docs from `nutritionists` into `coaches`
  - Step 4: `updateMany` on `coaches` — add `authId: null` to any doc missing the field (`{ authId: { $exists: false } }`)
  - Step 5: Count clients with `nutritionistId` field; if > 0, run `$rename: { 'nutritionistId': 'coachId' }` on `clients` collection
  - Step 6: Validate — count `coaches` must equal original `nutritionists` count; count clients with `nutritionistId` must be 0 — exit with code 1 on mismatch
  - Step 7: Log "Migration complete. Old 'nutritionists' collection preserved." — do NOT drop old collection
- [ ] TASK-20: Update Supabase test users — set `user_metadata.role = 'coach'` for all accounts with `role = 'nutritionist'`
  - Run in Supabase SQL Editor: `UPDATE auth.users SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"coach"') WHERE raw_user_meta_data->>'role' = 'nutritionist'`
  - Verify: query `SELECT email, raw_user_meta_data->>'role' AS role FROM auth.users` — no row should show `'nutritionist'`

## Phase 8: Verification

- [ ] TASK-21: Run `npm run lint` — zero ESLint errors
- [ ] TASK-22: Run TypeScript compiler — zero type errors
  - Run: `npx tsc --noEmit`
  - Zero references to `Nutritionist` type or `nutritionistId` property should remain in `src/`
- [ ] TASK-23: Run Playwright E2E tests — all pass
  - Run: `npx playwright test`
  - Fix any test file referencing `nutritionistId`, `NutritionistModel`, or role `'nutritionist'`
- [ ] TASK-24: Manual smoke test
  - Coach login with `role: 'coach'` in Supabase → must redirect to `/clients`
  - Client login with `role: 'client'` → must redirect to `/dashboard`
  - Coach attempting `/dashboard` → must redirect to `/clients`
  - Client attempting `/clients` → must redirect to `/dashboard`
  - `getCoachByAuthId(authId)` returns coach profile after migration
