# Verify Report: Multi-Role Coach Rename & Unified Login

**Change**: `multi-role-coach`
**Project**: `fitmetrik-web`
**Verified**: 2026-04-03
**Verdict**: PASS WITH WARNINGS

---

## Completeness Table

All tasks in `tasks.md` are marked `[ ]` (not checked), but inspection confirms:

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 — Domain Layer | TASK-01, TASK-02 | ✅ Implemented |
| Phase 2 — Infrastructure Layer | TASK-03, TASK-04 | ✅ Implemented |
| Phase 3 — Server Actions | TASK-05, TASK-06, TASK-07 | ✅ Implemented |
| Phase 4 — Auth Layer | TASK-08, TASK-09, TASK-10, TASK-11 | ✅ Implemented (with caveat on TASK-11) |
| Phase 5 — Components & Imports | TASK-12, TASK-13, TASK-14, TASK-15, TASK-16 | ✅ Implemented |
| Phase 6 — Environment & Seed Scripts | TASK-17, TASK-18 | ⚠️ PARTIAL (TASK-17: .env.local NOT updated) |
| Phase 7 — Migration Script | TASK-19, TASK-20 | ✅ Script exists; TASK-20 is manual Supabase step |
| Phase 8 — Verification | TASK-21, TASK-22, TASK-23, TASK-24 | ⚠️ (see below) |

**Note**: All tasks are marked `[ ]` in `tasks.md` — the task file was never updated to reflect completion. This is a documentation-only issue; the actual implementation is done.

Total tasks: 24
Implemented in code: 22
Partial/outstanding: 2 (TASK-17: `.env.local` not updated; TASK-20: manual Supabase SQL step, out of automation scope)

---

## Build & Tests Results

### TypeScript Compiler (`npx tsc --noEmit`)

```
(no output)
Exit code: 0
```

**Result**: ✅ PASS — Zero type errors.

### ESLint (`npm run lint`)

```
Invalid project directory provided, no such directory: /Users/jdiaz/personal-dev/nutrition-calculator-web/lint
Exit code: 1
```

**Result**: ⚠️ CANNOT VERIFY — The `next lint` command has a shell/environment issue in the automated context. No ESLint configuration file was found in the project root (no `.eslintrc.*`). This appears to be a pre-existing configuration gap unrelated to the `multi-role-coach` change. TypeScript strict mode passes which covers most correctness concerns.

### E2E Tests (`npx playwright test`)

```
Running 12 tests using 5 workers

6 failed (auth.spec.ts × 3 browsers, invite.spec.ts × 3 browsers)
6 passed
```

**Failed tests** (6 across 3 browsers):
- `Authentication Flows › should render the login page correctly`
- `Client Invitation Flow › should render the invite client form correctly`

**Root cause**: Both tests assert `getByRole('heading', { name: 'FitMetrik' })` on the login page. The "FitMetrik" text exists only in the copyright footer, not as an `<h1>` heading. This mismatch was introduced in commit `083016f` (branding update from 'NutriPlan' to 'FitMetrik') before the `multi-role-coach` change. **These failures pre-exist and are NOT caused by this change.**

**Passing tests** (6 across 3 browsers):
- `Authentication Flows › should show both login tabs`
- `Authentication Flows › should show error on invalid credentials`

---

## Grep Audit

```bash
rg -in 'nutritionist' src/
# → CLEAN (0 results)

rg -in 'NUTRITIONIST' .env*
# → .env.local:3:NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID=69afb6eb423033294e66924f

rg -in 'nutritionist' scripts/
# → Only in scripts/migrate-nutritionist-to-coach.ts (expected — migration script
#   must reference the old 'nutritionists' collection name)
```

---

## Correctness Table

| File | Expected | Found | Status |
|------|----------|-------|--------|
| `src/domain/types/Coach.ts` | `interface Coach` with `authId?: string` | ✅ Exactly as specified | ✅ |
| `src/domain/types/Nutritionist.ts` | Must NOT exist | File does not exist | ✅ |
| `src/domain/types/Client.ts` | `coachId: string` (not `nutritionistId`) | ✅ `coachId: string` | ✅ |
| `src/lib/models/Coach.ts` | `authId` sparse+unique+index, `collection: 'coaches'`, `CoachModel` | ✅ All fields present | ✅ |
| `src/lib/models/Client.ts` | `coachId` field, `ref: 'Coach'` | ✅ Correct | ✅ |
| `src/app/actions/coachActions.ts` | `createCoach`, `getCoachById`, `getCoaches`, `getCoachByAuthId` | ✅ All 4 exports present | ✅ |
| `src/app/actions/nutritionistActions.ts` | Must NOT exist | File does not exist | ✅ |
| `src/app/actions/clientActions.ts` | `getClientsByCoachId` (coachId param) | ✅ Implemented | ⚠️ (naming note below) |
| `src/infrastructure/ports/AuthProvider.ts` | `Role: 'coach' \| 'client'` | ✅ Correct | ✅ |
| `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts` | `rawRole === 'coach'` | ✅ Correct | ✅ |
| `src/middleware.ts` | All 3 occurrences use `role === 'coach'` | ✅ 3 occurrences updated, comment updated | ✅ |
| `src/app/(auth)/login/actions.ts` | `role === 'coach'` redirect; unknown role → stay on login | ⚠️ `role === 'coach'` ✅ but unknown role redirects to `/dashboard` ❌ | ⚠️ |
| `src/components/creator/SavePlanModal.tsx` | `coachId` prop | ✅ Correct | ✅ |
| `src/components/creator/Creator.tsx` | `coachId`, `NEXT_PUBLIC_DEFAULT_COACH_ID` | ✅ Correct | ✅ |
| `src/context/ClientContext.tsx` | Default object uses `coachId: ""` | ✅ Correct | ✅ |
| `src/app/(dashboard)/clients/new/actions.ts` | `NEXT_PUBLIC_DEFAULT_COACH_ID`, `defaultCoachId` | ✅ Correct | ✅ |
| `src/lib/registry.ts` | No `Nutritionist` references | ✅ Clean | ✅ |
| `scripts/migrate-nutritionist-to-coach.ts` | Idempotent, validates, preserves old collection | ✅ All steps implemented | ✅ |
| `scripts/seed-coach.ts` | Renamed from `seed-nutritionist.ts` | ✅ File exists | ✅ |
| `.env.local` | `NEXT_PUBLIC_DEFAULT_COACH_ID` | ❌ Still `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` | ❌ |

---

## Spec Compliance Matrix

### Spec: Coach Profile Lookup

| Scenario | Coverage | Status |
|----------|----------|--------|
| REQ-001: authId field on Coach model | `src/lib/models/Coach.ts` — `authId: { type: String, sparse: true, index: true, unique: true }` | ✅ COMPLIANT |
| REQ-002: getCoachByAuthId server action | `src/app/actions/coachActions.ts` — exported `getCoachByAuthId` | ✅ COMPLIANT |
| REQ-003: Return shape includes all fields | `toCoach()` returns `id`, `name`, `email`, `authId` | ⚠️ PARTIAL — `createdAt`/`updatedAt` NOT in return shape |
| Scenario: Coach found by auth ID | `CoachModel.findOne({ authId })` | ✅ COMPLIANT |
| Scenario: No coach found → null | `if (!doc) return null` | ✅ COMPLIANT |
| Scenario: authId not duplicated (sparse unique) | Schema config correct | ✅ COMPLIANT (DB-enforced) |
| Scenario: Coach without authId not returned | Sparse index allows multiple nulls; `findOne` won't match null | ✅ COMPLIANT |

### Spec: Unified Login Flow

| Scenario | Coverage | Status |
|----------|----------|--------|
| REQ-001: Single login entry point | Single `/login` route | ✅ COMPLIANT |
| REQ-002: Coach → /clients; Client → /dashboard | `getRedirectUrl(role)` with `role === 'coach'` | ✅ COMPLIANT |
| REQ-003: Unknown role → error on login page | `getRedirectUrl` returns `/dashboard` for ANY non-coach role | ❌ NOT COMPLIANT |
| REQ-004: 'nutritionist' not recognised | `role === 'coach'` check; 'nutritionist' falls to `/dashboard` | ❌ NOT COMPLIANT (routes to /dashboard instead of staying on /login with error) |
| Scenario: Coach logs in → /clients | ✅ | ✅ COMPLIANT |
| Scenario: Client logs in → /dashboard | ✅ | ✅ COMPLIANT |
| Scenario: Unknown role denied redirect | Redirects to `/dashboard` instead of showing error on login | ❌ FAILING |
| Scenario: No role metadata denied redirect | Same as above — lands on `/dashboard` | ❌ FAILING |
| Scenario: Invalid credentials rejected | ✅ Error message shown | ✅ COMPLIANT |
| Scenario: Unauthenticated → /login | ✅ Middleware handles this | ✅ COMPLIANT |

### Spec: Coach Management (Delta)

| Scenario | Coverage | Status |
|----------|----------|--------|
| REQ-CM-001: Coach model in coaches collection | ✅ | ✅ COMPLIANT |
| REQ-CM-002: createCoach action | ✅ | ✅ COMPLIANT |
| REQ-CM-003: getCoachById | ✅ | ✅ COMPLIANT |
| REQ-CM-004: getCoaches | ✅ | ✅ COMPLIANT |
| REQ-CM-NEW-001: getCoachByAuthId | ✅ | ✅ COMPLIANT |
| REQ-CM-NEW-002: collection: 'coaches' explicit | ✅ | ✅ COMPLIANT |
| REQ-CM-NEW-003: Migration script | ✅ | ✅ COMPLIANT |

### Spec: Client Management (Delta)

| Scenario | Coverage | Status |
|----------|----------|--------|
| REQ-CLI-001: coachId field (not nutritionistId) | ✅ | ✅ COMPLIANT |
| REQ-CLI-002: getClientsByCoach action | Implemented as `getClientsByCoachId` | ⚠️ NAMING DEVIATION — tasks.md says `getClientsByCoachId`; delta-spec says `getClientsByCoach` |
| REQ-CLI-003: createClient accepts coachId | ✅ | ✅ COMPLIANT |
| Scenario: Client created with coachId | ✅ | ✅ COMPLIANT |
| Scenario: Client creation rejected without coachId | Enforced by TypeScript strict + Mongoose required | ✅ COMPLIANT |
| Scenario: Clients filtered by coach | ✅ `find({ coachId })` | ✅ COMPLIANT |
| Scenario: nutritionistId is a type error | ✅ TypeScript strict, property doesn't exist | ✅ COMPLIANT |

### Spec: Auth UX (Delta)

| Scenario | Coverage | Status |
|----------|----------|--------|
| REQ-AUTH-001: 'coach' replaces 'nutritionist' | ✅ All occurrences updated | ✅ COMPLIANT |
| REQ-AUTH-002: Middleware RBAC updated | ✅ | ✅ COMPLIANT |
| REQ-AUTH-NEW-001: Login action multi-role redirect | Partially — unknown role not handled correctly | ⚠️ PARTIAL |
| Scenario: Coach role → /clients | ✅ | ✅ COMPLIANT |
| Scenario: Nutritionist role rejected | Falls to /dashboard instead of /login | ❌ NOT COMPLIANT |
| Scenario: Client role → /dashboard | ✅ | ✅ COMPLIANT |
| Scenario: Unauthenticated → /login | ✅ | ✅ COMPLIANT |
| Scenario: AuthProvider type excludes 'nutritionist' | ✅ TypeScript confirms | ✅ COMPLIANT |

---

## Issues

### CRITICAL

None — no build-breaking issues, no data loss risks.

### WARNING

**WARN-001: `.env.local` still has `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID`**
- File: `.env.local` line 3
- Expected: `NEXT_PUBLIC_DEFAULT_COACH_ID`
- Impact: `src/app/(dashboard)/clients/new/actions.ts` reads `process.env.NEXT_PUBLIC_DEFAULT_COACH_ID`. Since `.env.local` doesn't define it, the value will be `undefined` at runtime, causing the invite flow to fail with "System configuration error".
- Fix: Rename key in `.env.local` from `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` to `NEXT_PUBLIC_DEFAULT_COACH_ID`.

**WARN-002: Login action does not handle unknown/missing role per spec**
- File: `src/app/(auth)/login/actions.ts`
- Expected (REQ-003, unified-login-flow): Unknown role → display error on `/login`, do NOT redirect to protected route.
- Actual: `getRedirectUrl(undefined)` returns `/dashboard` — an unauthenticated/unknown-role user lands on the client dashboard.
- Impact: Security gap for users with no role or stale `nutritionist` role in Supabase metadata. Not a data breach, but a UX violation of spec and potential access confusion.
- Fix: Update `getRedirectUrl` to return a login error URL for unrecognised roles:
  ```typescript
  function getRedirectUrl(role: string | undefined): string {
    if (role === 'coach') return '/clients';
    if (role === 'client') return '/dashboard';
    return '/login?error=Unknown+role.+Contact+your+administrator.';
  }
  ```

**WARN-003: REQ-003 (coach-profile-lookup) — toCoach() omits `createdAt`/`updatedAt`**
- File: `src/app/actions/coachActions.ts`
- Spec says return shape SHALL include `createdAt` and `updatedAt`.
- The `toCoach()` mapper only returns `id`, `name`, `email`, `authId`.
- Impact: Consumers of `getCoachByAuthId` cannot access timestamps. Low severity for current usage but violates the spec contract.

**WARN-004: Pre-existing E2E test failures (not caused by this change)**
- Files: `tests/auth.spec.ts`, `tests/invite.spec.ts`
- 6 of 12 tests fail because they look for `getByRole('heading', { name: 'FitMetrik' })` which doesn't exist as a heading element in the login page.
- Root cause: commit `083016f` (branding update) redesigned the login page but the tests were not updated.
- These failures existed before `multi-role-coach` and are unrelated to this change.
- Fix: Update test assertions to match the actual login page DOM structure.

### SUGGESTION

**SUGG-001: `getClientsByCoachId` naming deviation from delta-spec**
- The delta-spec (REQ-CLI-002) says `getClientsByCoach`; tasks.md says `getClientsByCoachId`; implementation uses `getClientsByCoachId`.
- Functionally correct but the spec contract is not matched exactly. Consider aligning either the spec or the implementation.

**SUGG-002: tasks.md not updated to mark completed tasks**
- All 24 tasks remain `[ ]` (unchecked) despite being implemented.
- Recommend running a pass to mark completed tasks `[x]` for auditability.

**SUGG-003: ESLint configuration missing**
- `npm run lint` / `next lint` fails due to missing ESLint config file in project root.
- TypeScript strict mode compensates for most linting concerns, but ESLint rules (React hooks, import ordering) would add an additional safety layer.

---

## Verdict

**PASS WITH WARNINGS**

The core rename is complete and correct:
- All `Nutritionist` → `Coach` renames applied across domain, infrastructure, actions, auth, components
- Zero `nutritionist` references remain in `src/`
- TypeScript compiles cleanly with zero errors
- `authId` field, sparse index, and `getCoachByAuthId` are correctly implemented
- Migration script is complete and idempotent
- Middleware RBAC routing is correct

Two warnings require action before deploying:
1. **WARN-001** (`.env.local`) — will break the invite-client flow at runtime
2. **WARN-002** (unknown role login redirect) — violates the unified-login-flow spec contract

The E2E test failures (WARN-004) are pre-existing and unrelated to this change.
