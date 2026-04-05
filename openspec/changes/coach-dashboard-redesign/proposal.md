# Proposal: Coach Dashboard Redesign & Invitation System

## Intent

Give coaches a professional, data-driven home screen at `/clients` that only shows **their** clients, replaces the current unfiltered list with a Stitch-designed dashboard (metric cards + sortable roster table), and adds a dedicated coach invitation flow so the platform can onboard coaches independently of the existing client invite.

## Scope

### In Scope

- **Routing**: Redirect coach home from `/` to `/clients`; update middleware so `/` always redirects (coach -> `/clients`, client -> `/dashboard`, unauth -> `/login`)
- **Dashboard UI**: Redesign `(dashboard)/clients` per Stitch mockup -- 3 metric cards (Active Clients, Pending Plans, Avg. Completion) + filterable, sortable client roster table with pagination
- **Data access fix**: Replace `getClients()` (returns ALL clients) with `getClientsByCoachId(coachId)` in the dashboard; resolve current coach via `getCoachByAuthId(authId)` from session
- **Coach invitation flow**: New email template (`InviteCoachEmail`) + parameterized `inviteUser(email, role)` in `AuthProvider` port and `SupabaseAuthProvider` adapter (currently hardcoded to `role: 'client'`)
- **Client invite fix**: Current `inviteClient` action uses `NEXT_PUBLIC_DEFAULT_COACH_ID` env var -- replace with current coach's ID from session
- **Remove legacy root page**: Delete `src/app/page.tsx` (the old MUI glass-card client list) once `/clients` route is the canonical coach home

### Out of Scope

- Analytics/reporting features (charts, trends) -- future change
- Diet plan management dashboard -- separate change
- Settings, profile, or team management screens
- Client-portal redesign (`/dashboard` route group)
- Real-time notifications or WebSocket features

## Problem Statement

Today the coach lands on `src/app/page.tsx`, a `'use client'` component that calls `getClients()` which does `ClientModel.find()` with **no coach filter** -- every coach sees every client in the database. The UI is a basic MUI card list with no metrics, no sorting, no pagination. Additionally, the invitation system only supports inviting clients (hardcoded `role: 'client'` in `SupabaseAuthProvider.inviteUser()` and hardcoded `NEXT_PUBLIC_DEFAULT_COACH_ID` in the invite action), making it impossible to onboard new coaches through the platform.

## Success Criteria

1. Coach logs in -> middleware redirects to `/clients` (not `/`)
2. `/` always redirects: coach -> `/clients`, client -> `/dashboard`, unauth -> `/login`
3. Dashboard shows ONLY the current coach's clients (filtered by `coachId` from `getCoachByAuthId(session.user.id)`)
4. Three metric cards render: Active Clients count, Pending Plans count, Avg. Completion rate
5. Client roster table matches Stitch design: columns (Name, Status, Plans, Last Updated), sortable, paginated
6. `AuthProvider.inviteUser(email, role)` accepts a `role` parameter (`'coach' | 'client'`)
7. Coach invite email uses a separate template (`InviteCoachEmail`) with appropriate copy
8. Client invite action uses current coach's ID from session instead of env var
9. `src/app/page.tsx` removed; no dead code left at root

## Architecture Decisions

### Coach identity resolution
The dashboard (Server Component) will:
1. Get Supabase session via `authProvider.getSession()`
2. Call `getCoachByAuthId(session.user.id)` to get the coach's MongoDB `_id`
3. Call `getClientsByCoachId(coachId)` -- already exists in `clientActions.ts` (line 84)

Both `getCoachByAuthId` and `getClientsByCoachId` already exist and are tested. No new server actions needed for data fetching.

### Invite flow parameterization
- `AuthProvider` port: `inviteUser(email: string, role: Role)` -- add `role` param
- `SupabaseAuthProvider`: Pass `role` to `data: { role }` in `admin.inviteUserByEmail()`
- `inviteClient` action: Get current coach ID from session instead of `NEXT_PUBLIC_DEFAULT_COACH_ID`
- New `inviteCoach` action: Similar flow but creates Coach entity in DB (not Client)

### Email templates
- Existing `InviteUserEmail` stays as the client invite template (rename to `InviteClientEmail` for clarity)
- New `InviteCoachEmail` template with coach-specific copy ("Has sido invitado como coach a FitMetrik")

## Dependencies

1. **`getCoachByAuthId(authId)`** -- already exists in `coachActions.ts` (line 47), ready to use
2. **`getClientsByCoachId(coachId)`** -- already exists in `clientActions.ts` (line 84), ready to use
3. **Supabase `user_metadata.role`** -- already set during invite; middleware already reads it (line 25 of `middleware.ts`)
4. **Stitch mockup** -- must be fetched via `mcp_StitchMCP_get_screen` during design phase for pixel-accurate layout

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Multi-coach data leak**: `getClients()` returns ALL clients | HIGH -- privacy violation | Replace with `getClientsByCoachId()` + coach identity from session. Add server-side guard. |
| **Coach identity not found**: `getCoachByAuthId()` returns null for a valid coach session | MEDIUM -- broken dashboard | Handle gracefully: show "Coach profile not found" error + log for debugging. This can happen if coach was invited via Supabase but Coach entity wasn't created in MongoDB. |
| **Email link drift**: Old invite emails point to `/` which now redirects | LOW -- minor UX friction | Root (`/`) redirects to `/clients` for coaches, so old links still work. No broken flows. |
| **Default coach ID removal**: Removing `NEXT_PUBLIC_DEFAULT_COACH_ID` breaks existing invite flow during migration | MEDIUM -- invite downtime | Deploy in order: (1) add role param to inviteUser, (2) update invite action to use session coach, (3) remove env var. |
| **Metrics computation**: Active Clients / Pending Plans / Avg. Completion need clear definitions | LOW -- wrong numbers | Define in specs phase: "Active" = has at least 1 plan, "Pending" = client exists but 0 plans, "Completion" = deferred (mock for now). |

## Next Steps

Specs will define:
- Dashboard data model: what metrics are computed from, exact formulas
- Table columns, sort order, default pagination size, filtering rules
- Coach invite flow: email template content, Supabase role parameter, MongoDB Coach entity creation
- Routes & redirects: exact middleware rules, edge cases (unknown role, expired session)
- Component breakdown: which are Server vs Client Components, container/presentational split
