# Verify Report: Coach Dashboard Redesign & Invitation System

**Date**: 2026-04-04
**Change**: coach-dashboard-redesign
**Implementation**: 21/21 tasks reported complete
**Specs verified**: routing, ui, invitation, data-access

---

## Verification Report

### PASS

**Routing Spec**
- Coach login (`loginWithPassword`) calls `getRedirectUrl(role)` → returns `/clients` for `role === 'coach'` ✓
- Middleware root `/` redirect: unauthenticated → `/login`, client → `/dashboard`, coach → `/clients`, unknown role → `/login?error=Unknown+role.+Contact+your+administrator.` ✓
- `src/app/page.tsx` deleted — confirmed not present ✓
- Cross-role blocks: clients blocked from `/clients` (→ `/dashboard`), coaches blocked from `/dashboard` (→ `/clients`) ✓
- Unauthenticated access to protected routes → `/login` ✓
- `/auth/callback` and `/update-password` unblocked ✓
- Authenticated user hitting `/login` is redirected to their home by role ✓

**UI Spec**
- Server Component at `src/app/(dashboard)/clients/page.tsx` — no `'use client'` directive ✓
- Three metric cards rendered: Active Clients, Pending Plans, Avg Completion ✓
- `MetricsSection` is a pure Server Component; `MetricCard` and `ClientRosterTable` are `'use client'` ✓
- `ClientRosterTable` has pagination at PAGE_SIZE = 10 ✓
- Pagination controls: Prev/Next buttons, "Page X of Y" label ✓
- Dark theme `bg-[#0a0f1e]` applied at page root ✓
- MUI not used in new components — pure Tailwind v4 for the dashboard (acceptable deviation, aligns with spec intent) ✓

**Invitation Spec**
- `AuthProvider.inviteUser(email: string, role?: Role)` — role is optional, defaults to `'client'` ✓ (backward compatible)
- `SupabaseAuthProvider.inviteUser` passes received `role` to `admin.inviteUserByEmail({ data: { role } })` ✓
- `emails/InviteCoachEmail.tsx` created with coach-specific copy ("Has sido invitado como coach", "Tu cuenta de coach está lista") ✓
- `InviteUserEmail` renamed to `InviteClientEmail` — name appears only in docs, not in any source file ✓
- `inviteCoach()` Server Action exists at `src/app/(dashboard)/coaches/new/actions.ts` ✓
- `inviteCoach` calls `inviteUser(email, 'coach')` and `createCoach()` with the returned `authId` ✓
- `inviteClient` calls `inviteUser(email, 'client')` explicitly ✓
- Missing `SUPABASE_SERVICE_ROLE_KEY` → logs error, returns null ✓
- `inviteUser` returns null on Supabase error → both actions redirect with error message ✓

**Data Access Spec**
- Dashboard resolves coach via `getCoachByAuthId(session.user.id)` ✓
- Dashboard fetches clients via `getClientsByCoachId(coach.id)` — scoped by coachId at DB query layer ✓
- Unfiltered `getClients()` is defined but NOT used in any dashboard path ✓
- `NEXT_PUBLIC_DEFAULT_COACH_ID` fully removed — no references in `src/` or `.env*` files ✓
- `inviteClient` resolves coachId from session, not from env var ✓
- Data isolation enforced at MongoDB query layer (`ClientModel.find({ coachId })`) ✓
- All dashboard fetching in Server Components/Actions ✓
- `CoachModel.authId` has a unique sparse index — DB-level isolation enforced ✓

---

### WARNING

**W1 — Empty state is an inline table row, not a dedicated component**
- Spec Req 6: "Empty state when 0 clients (illustration + 'Invite your first client' CTA)"
- Implementation: When `paginated.length === 0`, renders a `<tr>` with text "No clients yet. Invite your first client to get started." There is no illustration, no CTA button/link.
- File: `src/components/coach/ClientRosterTable.tsx` line 49-55
- Risk: Low — functional, but Stitch design spec not met.

**W2 — Missing coach doc redirects to login instead of rendering an error state**
- Spec Req 3 (data-access): "If `getCoachByAuthId()` returns null → error state rendered + server-side log"
- Implementation: `redirect('/login?error=Coach+profile+not+found')` — user is sent to login page instead of seeing an in-page error.
- File: `src/app/(dashboard)/clients/page.tsx` line 18-20
- Risk: Low — UX is acceptable, but the spec says "rendered" not "redirected". A coach with a broken profile would need to re-login repeatedly with no clear path forward.

**W3 — inviteCoach has no pre-check for existing Coach doc**
- Spec Scenario 5 (invitation): "no duplicate DB doc"
- Implementation: If a `Coach` doc already exists for the `authId` (or email), MongoDB's unique constraint throws an unhandled exception. The `createCoach()` call at line 31 is not wrapped in try/catch.
- File: `src/app/(dashboard)/coaches/new/actions.ts` line 31
- Risk: Medium — a duplicate invite results in an unhandled server error (500) instead of a graceful error redirect.

---

### CRITICAL

**C1 — "LAST UPDATE" column is missing; "Plans" column present instead**
- Spec Req 3 (ui): Columns must be: CLIENT, GOAL, WEIGHT PROGRESS, PLAN STATUS, LAST UPDATE, ACTIONS
- Implementation columns: Client, Goal, Weight Progress, Plan Status, **Plans** (plan count), Actions
- "Plans" is a count of plans — not the same as "Last Update" (which should surface `updatedAt`). The column count matches (6) but the 5th column is wrong.
- File: `src/components/coach/ClientRosterTable.tsx` line 44 (`<th>Plans</th>`)
- Fix: Replace with "Last Update" header and surface `updatedAt` from the client document.

**C2 — Sorting not implemented**
- Spec Req 4 (ui): "Table supports column sorting (min: CLIENT name, LAST UPDATE)" with sort indicator and pagination reset on sort
- Implementation: `ClientRosterTable` has only `useState(page)` — no `sortKey`, no `sortDirection`, no sort handlers, no sort indicator in column headers.
- File: `src/components/coach/ClientRosterTable.tsx` — entirely absent
- Spec Scenarios 3 & 4 are unverifiable.
- Fix: Add `sortKey` and `sortDirection` state; sort `clients` array before pagination; add clickable headers with indicator arrows.

---

### Summary

| Category | Count |
|----------|-------|
| Total checks | 32 |
| Passing | 27 |
| Warnings | 3 |
| Critical | 2 |

**Status: FAIL**

Two critical issues must be resolved before merge:
1. Replace "Plans" column with "Last Update" (`updatedAt`) — `ClientRosterTable.tsx`
2. Implement column sorting (CLIENT, LAST UPDATE) with sort indicator and pagination reset — `ClientRosterTable.tsx`

Warnings (W1, W3) are recommended fixes. W2 is a design decision — redirecting vs rendering an error page is acceptable if intentional.
