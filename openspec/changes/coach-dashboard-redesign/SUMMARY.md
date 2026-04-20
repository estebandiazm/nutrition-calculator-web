# Coach Dashboard Redesign — Final Summary

## What Was Built

A complete redesign of the coach home page (`/clients`) with three major components:

1. **Multi-role routing** — Fixed root redirect to send coaches to `/clients` (not `/`), clients to `/dashboard`, and unauth users to `/login`
2. **Coach dashboard UI** — New Server Component at `/clients` with three metric cards (Active Clients, Pending Plans, Avg. Completion %) and a full-featured client roster table (sorting, pagination, empty state)
3. **Data isolation** — Coaches now see only their own clients; coach identity is resolved from Supabase session, not hardcoded env vars
4. **Parameterized invitation system** — `inviteUser` now accepts a `role` parameter; separate email templates for coaches and clients

---

## Key Changes

### Files Modified
- **`src/middleware.ts`** — Fixed root `/` redirect for `role === 'coach'` to go to `/clients`
- **`src/app/page.tsx`** — Removed (root path no longer renders content)
- **`src/infrastructure/ports/auth-provider.ts`** — Added `role: Role` parameter to `inviteUser` method
- **`src/infrastructure/adapters/supabase-auth-provider.ts`** — Pass role to Supabase `inviteUserByEmail` metadata
- **`src/app/actions/invite-client.ts`** — Updated to call `inviteUser(email, 'client')` explicitly; uses session coach ID instead of `NEXT_PUBLIC_DEFAULT_COACH_ID`

### Files Created
- **`src/app/(dashboard)/clients/page.tsx`** — New coach dashboard Server Component
- **`src/app/(dashboard)/clients/ClientRosterTable.tsx`** — Client roster with sorting & pagination
- **`src/app/(dashboard)/clients/MetricsCard.tsx`** — Metric card component (Active Clients, Pending Plans, Avg. Completion %)
- **`src/app/(dashboard)/clients/EmptyStateCard.tsx`** — Empty state when coach has no clients
- **`src/app/actions/invite-coach.ts`** — New Server Action for coach invitations
- **`emails/InviteClientEmail.tsx`** — Renamed from `InviteUserEmail.tsx`
- **`emails/InviteCoachEmail.tsx`** — New coach-specific email template
- **E2E tests** — `tests/e2e/coach-dashboard.spec.ts` and `tests/e2e/auth-redirect.spec.ts`

### Environment Changes
- Removed `NEXT_PUBLIC_DEFAULT_COACH_ID` from `.env.local`

---

## How to Test

### Route Redirect
1. Log in as a coach → should land on `/clients` (not `/`)
2. Navigate to `/` while authenticated as coach → should redirect to `/clients`
3. Navigate to `/` while authenticated as client → should redirect to `/dashboard`
4. Log out and navigate to `/` → should redirect to `/login`

### Coach Dashboard
1. As a coach with clients: dashboard should display 3 metric cards and a table with all clients
2. As a coach with 0 clients: dashboard should show empty state with "Invite your first client" CTA
3. Sort table by "CLIENT" column → rows should alphabetize A-Z (toggle to Z-A on second click)
4. Sort table by "LAST UPDATE" → rows should order by timestamp (most recent first)
5. With 25+ clients: pagination should show page controls; page size should be 10 rows

### Data Isolation
1. Log in as Coach A → dashboard shows only Coach A's clients
2. (In separate browser/session) Log in as Coach B → dashboard shows only Coach B's clients
3. Coaches should never see each other's client lists

### Invitations
1. Coach invites a client → invited client receives email with "Tu nutricionista te ha invitado" copy
2. Coach invites a coach → invited coach receives email with coach-specific copy (no client text)
3. Invite to already-registered email → action fails gracefully with error message

### E2E Tests
```bash
npx playwright test tests/e2e/auth-redirect.spec.ts
npx playwright test tests/e2e/coach-dashboard.spec.ts
```

---

## Known Limitations

- **Avg. Completion % metric** is mocked as `0%` until plan adherence tracking is implemented
- **Weight Progress column** is mocked — real weight tracking is TBD
- **Client detail page route** is TBD in next design phase
- **Coach invitation form UI** is TBD (no UI route yet for `/coaches/new`)

---

## Next Steps

1. **Coach management UI** — Build admin/coach-facing form to invite coaches (Route TBD)
2. **Client detail page** — Implement `/clients/[id]` route for viewing/managing individual client
3. **Plan adherence tracking** — Replace mocked Avg. Completion % with real calculation
4. **Weight tracking** — Implement real weight progress in the roster table
5. **Merge to main** — Create PR from `feat/coach-dashboard-redesign` → `main`

---

## Spec & Design References

- **Consolidated spec**: `openspec/specs/coach-dashboard/spec.md`
- **Delta specs** (archived in change folder):
  - `routing.md` — root redirect requirements
  - `ui.md` — dashboard UI and table specs
  - `invitation.md` — parameterized invite flow
  - `data-access.md` — data isolation and coach identity resolution
- **Stitch mockup** — Coach dashboard with metric cards and client table

---

## Branch & Commit

- **Branch**: `feat/coach-dashboard-redesign`
- **Latest commit**: `19fad68` — ✨feat(auth): multi-role login and rename Nutritionist to Coach
- **Status**: Ready for merge to `main`
