# Proposal: Multi-Role Coach Rename & Unified Login

## Intent

Rename the "Nutritionist" aggregate to "Coach" across the entire stack, enable multi-role login from a single form, and add the missing `authId` link on the Coach model so profile lookup works for both roles.

## Scope

### In Scope

- Rename domain type, Mongoose model, server actions, and all references from `Nutritionist` to `Coach`
- Rename `Client.nutritionistId` to `Client.coachId`
- Add `authId` (sparse+indexed) to Coach schema, mirroring Client pattern
- Add `getCoachByAuthId()` server action
- Update Supabase role value from `'nutritionist'` to `'coach'`
- Update middleware RBAC to route `'coach'` role to `/clients`
- Unify login: single form detects role, redirects accordingly
- One-time MongoDB migration script (`scripts/migrate-nutritionist-to-coach.ts`)

### Out of Scope

- New UI for coach dashboard (existing pages keep working)
- Backward compatibility with `'nutritionist'` role in Supabase (not in production)
- Multi-tenant or team-based coach features

## Capabilities

### New Capabilities

- **Coach profile lookup by auth ID** (`getCoachByAuthId`)
- **Unified login flow**: role-based redirect from single `/login` form

### Modified Capabilities

- **nutritionist-management** spec: renamed to coach-management, collection `coaches`, `authId` field added
- **client-management** spec: `nutritionistId` renamed to `coachId`, `getClientsByNutritionist` renamed to `getClientsByCoach`
- **auth-ux** spec: role value `'nutritionist'` becomes `'coach'`, middleware routing updated

## Approach

1. **Domain-first rename**: update `src/domain/types/` and `src/domain/services/` first (pure TS, no side effects)
2. **Infrastructure layer**: rename Mongoose model, add `authId`, set `collection: 'coaches'`
3. **Server actions**: rename file and all exports, add `getCoachByAuthId`
4. **Auth layer**: update role enum, middleware routes, AuthProvider
5. **Components**: update all imports referencing nutritionist types/actions
6. **Migration script**: copy `nutritionists` collection to `coaches`, rename `nutritionistId` to `coachId` in `clients`

## Affected Areas

| Area | Files | Change |
|------|-------|--------|
| Domain types | `src/domain/types/Nutritionist.ts` | Rename to `Coach.ts`, update type name |
| Domain types | `src/domain/types/Client.ts` | `nutritionistId` to `coachId` |
| Mongoose model | `src/lib/models/Nutritionist.ts` | Rename to `Coach.ts`, add `authId`, set collection |
| Mongoose model | `src/lib/models/Client.ts` | Field rename `nutritionistId` to `coachId` |
| Server actions | `src/app/actions/nutritionistActions.ts` | Rename to `coachActions.ts`, add `getCoachByAuthId` |
| Auth port | `src/infrastructure/ports/AuthProvider.ts` | Role: `'nutritionist'` to `'coach'` |
| Auth adapter | `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts` | Role mapping update |
| Middleware | `src/middleware.ts` | Route `'coach'` to `/clients` |
| Login action | `src/app/(auth)/login/actions.ts` | Multi-role redirect logic |
| Migration | `scripts/migrate-nutritionist-to-coach.ts` | New one-time script |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missed rename in imports/components | Medium | Build breaks | Use TypeScript compiler errors as exhaustive check |
| Supabase `user_metadata.role` mismatch | Low | Auth failure | Update test users in Supabase before deploying |
| MongoDB data loss during migration | Low | High | Migration script backs up before rename; app not in production |

## Rollback Plan

Not in production. Git revert of the feature branch restores all code. MongoDB migration script is idempotent and the old collection is preserved (copy, not move).

## Dependencies

- Supabase admin access to update `user_metadata.role` for existing test users
- MongoDB shell or script runner access for migration

## Success Criteria

1. Login with `'coach'` role redirects to `/clients`; login with `'client'` role redirects to `/dashboard`
2. `getCoachByAuthId()` returns the correct coach document
3. Zero references to `Nutritionist` or `nutritionistId` remain in `src/`
4. All existing E2E tests pass after rename
5. Migration script successfully copies documents and renames fields
