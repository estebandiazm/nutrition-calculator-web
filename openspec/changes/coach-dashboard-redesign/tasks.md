# Tasks: Coach Dashboard Redesign & Invitation System

**Change**: `coach-dashboard-redesign`
**Status**: Ready for apply
**Total tasks**: 22 across 6 phases

---

## Dependency Graph

```
Phase 1 (Auth) → Phase 2 (Email) → Phase 3 (Actions) → Phase 4 (Routing) → Phase 5 (UI)
                                                                               ↓
                                                                         Phase 6 (Cleanup)
```

Phases 1–5 are strictly sequential. Phase 6 can only run after all prior phases are done.

---

## Phase 1: Auth Provider Changes

> No dependencies. Start here.

---

### Task 1.1: Add `role` param to `AuthProvider.inviteUser()`

**Description**: Update the port interface so `inviteUser` accepts an optional `role` parameter, keeping the signature backward-compatible.

**Files**:
- `src/infrastructure/ports/AuthProvider.ts` — change line 30:
  ```ts
  // Before
  inviteUser(email: string): Promise<{ id: string } | null>;

  // After
  inviteUser(email: string, role?: Role): Promise<{ id: string } | null>;
  ```
  Update JSDoc to reflect the new param.

**Dependencies**: None

**Acceptance Criteria**:
- [ ] `inviteUser` signature accepts `role?: Role`
- [ ] JSDoc updated
- [ ] TypeScript compiles without errors (no build step needed — check types mentally)
- [ ] Existing callers (`inviteClient` action) still compile without changes (param is optional)

**Estimated Effort**: Small (< 30 min)

---

### Task 1.2: Implement `role` param in `SupabaseAuthProvider.inviteUser()`

**Description**: Update the Supabase adapter to accept and forward the `role` param into `user_metadata`, replacing the hardcoded `'client'`.

**Files**:
- `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts`:
  - Line 47: change `async inviteUser(email: string)` → `async inviteUser(email: string, role: Role = 'client')`
  - Line 70: change `data: { role: 'client' }` → `data: { role }`

**Dependencies**: Task 1.1 (port must define the signature first)

**Acceptance Criteria**:
- [ ] Adapter signature matches port interface
- [ ] `role` defaults to `'client'` (backward compatible)
- [ ] `user_metadata.role` is set from the param, not hardcoded
- [ ] TypeScript compiles

**Estimated Effort**: Small (< 30 min)

---

### Task 1.3: Fix `createCoach()` signature to accept `authId`

**Description**: `createCoach()` currently does not accept `authId`, so a newly invited coach cannot have their Supabase UUID linked at creation time. Fix the signature to mirror the `createClient()` pattern.

**Files**:
- `src/app/actions/coachActions.ts`:
  - Line 21–23: change signature from `Pick<Coach, 'name' | 'email'>` to `Pick<Coach, 'name' | 'email'> & Partial<Pick<Coach, 'authId'>>`
  - Line 25–28: add `authId: data.authId` to the `CoachModel.create()` call

**Dependencies**: None (can run in parallel with Task 1.1)

**Acceptance Criteria**:
- [ ] `createCoach()` accepts optional `authId`
- [ ] `authId` is persisted to MongoDB when provided
- [ ] `toCoach()` helper already maps `authId` — no change needed there
- [ ] TypeScript compiles

**Estimated Effort**: Small (< 30 min)

---

## Phase 2: Email Templates

> Depends on Phase 1 being complete (no direct code dependency, but sequencing discipline).

---

### Task 2.1: Rename `InviteUserEmail.tsx` → `InviteClientEmail.tsx`

**Description**: Rename the existing email template file and update all internal references (component name, export, preview props) to match the new name.

**Files**:
- `emails/InviteUserEmail.tsx` → rename to `emails/InviteClientEmail.tsx`
- Inside the new file:
  - Rename interface `InviteUserEmailProps` → `InviteClientEmailProps`
  - Rename default export function `InviteUserEmail` → `InviteClientEmail`
  - Update named export: `export { InviteClientEmail }` (remove old `export { InviteUserEmail }`)
  - Update `InviteClientEmail.PreviewProps` assignment
  - Update `<Preview>` copy if needed (currently says "nutricionista" — keep or update per design)

**Dependencies**: None

**Acceptance Criteria**:
- [ ] File renamed to `InviteClientEmail.tsx`
- [ ] No remaining references to `InviteUserEmail` inside the file
- [ ] `npm run email` shows the template without errors
- [ ] Named export `InviteClientEmail` works

**Estimated Effort**: Small (< 30 min)

---

### Task 2.2: Create `InviteCoachEmail.tsx`

**Description**: Create a new email template for coach invitations with coach-specific copy (onboarding tone, mentions managing clients, not being a client).

**Files**:
- `emails/InviteCoachEmail.tsx` — new file, based on `InviteClientEmail.tsx` structure
  - Interface: `InviteCoachEmailProps { actionUrl: string }`
  - `<Preview>`: `"Tu cuenta de coach en FitMetrik está lista"`
  - `<Heading>`: `"¡Bienvenido a FitMetrik, Coach!"`
  - Body copy: Explain they have a coach account to manage clients and nutrition plans
  - CTA button: `"Activar mi cuenta de coach"`
  - Same visual design (dark theme, pink/purple palette)
  - `InviteCoachEmail.PreviewProps` with same `actionUrl` template value

**Dependencies**: Task 2.1 (use renamed template as reference)

**Acceptance Criteria**:
- [ ] File exists at `emails/InviteCoachEmail.tsx`
- [ ] Copy is coach-specific, not client-facing
- [ ] `npm run email` shows both templates
- [ ] Default export + named export both present

**Estimated Effort**: Small (< 30 min)

---

## Phase 3: Server Actions

> Depends on Phases 1 and 2.

---

### Task 3.1: Update `inviteClient()` — resolve coachId from session

**Description**: Remove the `NEXT_PUBLIC_DEFAULT_COACH_ID` env var dependency and instead resolve the coachId from the authenticated session using the identity chain: JWT → authId → Coach doc → coachId.

**Files**:
- `src/app/(dashboard)/clients/new/actions.ts` — full rewrite of the action body:
  1. Import `authProvider` from `@/lib/registry`
  2. Import `getCoachByAuthId` from `@/app/actions/coachActions`
  3. After validating email/name: call `authProvider.getSession()` to get `session.user.id` (the authId)
  4. Call `getCoachByAuthId(authId)` — if null, redirect with error "Coach profile not found"
  5. Pass `role: 'client'` explicitly to `authProvider.inviteUser(email, 'client')`
  6. Use `coach.id` as `coachId` in `createDbClient()`
  7. Remove all references to `process.env.NEXT_PUBLIC_DEFAULT_COACH_ID`

**Dependencies**: Tasks 1.1, 1.2

**Acceptance Criteria**:
- [ ] No env var references in the file
- [ ] coachId comes from session-authenticated Coach doc
- [ ] Error handled when Coach doc not found
- [ ] `role: 'client'` passed explicitly to `inviteUser()`
- [ ] Existing invite flow still works end-to-end

**Estimated Effort**: Medium (30 min - 1 hour)

---

### Task 3.2: Create `inviteCoach()` Server Action

**Description**: Create a new server action to invite a new coach user, mirroring `inviteClient()` but with `role: 'coach'` and creating a `Coach` document in MongoDB instead of a `Client`.

**Files**:
- `src/app/(dashboard)/coaches/new/actions.ts` — new file:
  ```
  'use server'

  inviteCoach(formData: FormData):
    1. Extract email, name from formData
    2. authProvider.inviteUser(email, 'coach') → get authUser
    3. createCoach({ name, email, authId: authUser.id })
    4. revalidatePath('/clients')
    5. redirect('/clients?success=Coach invited successfully')
  ```

**Dependencies**: Tasks 1.1, 1.2, 1.3

**Acceptance Criteria**:
- [ ] File exists at `src/app/(dashboard)/coaches/new/actions.ts`
- [ ] `role: 'coach'` passed to `inviteUser()`
- [ ] Coach document created with `authId` linked
- [ ] Error cases handled (missing fields, invite failure)
- [ ] TypeScript compiles

**Estimated Effort**: Small (< 30 min)

---

### Task 3.3: Create Coach invite form page

**Description**: Create the page component for inviting a new coach at the `/coaches/new` route, reusing the same form structure as the invite client page.

**Files**:
- `src/app/(dashboard)/coaches/new/page.tsx` — new file:
  - Import `inviteCoach` from `./actions`
  - Same form layout as `src/app/(dashboard)/clients/new/page.tsx`
  - Title: "Invite New Coach"
  - Same fields: Full Name + Email
  - Success/error query param handling

**Dependencies**: Task 3.2

**Acceptance Criteria**:
- [ ] Route `/coaches/new` renders without errors
- [ ] Form submits to `inviteCoach` action
- [ ] Error/success messages display from query params
- [ ] No `'use client'` — pure Server Component with server action binding

**Estimated Effort**: Small (< 30 min)

---

## Phase 4: Routing

> Depends on Phases 1–3. These three tasks are independent of each other within Phase 4.

---

### Task 4.1: Update login redirect for coach role

**Description**: The `getRedirectUrl()` function in login actions currently sends coaches to `'/'`. Update it to send coaches directly to `'/clients'`.

**Files**:
- `src/app/(auth)/login/actions.ts`:
  - Line 7: change `if (role === 'coach') return '/';` → `if (role === 'coach') return '/clients';`

**Dependencies**: None (can run independently within Phase 4)

**Acceptance Criteria**:
- [ ] `getRedirectUrl('coach')` returns `'/clients'`
- [ ] `getRedirectUrl('client')` still returns `'/dashboard'`
- [ ] No other lines changed in the file

**Estimated Effort**: Small (< 30 min)

---

### Task 4.2: Update middleware — coach root redirect

**Description**: The middleware currently lets the coach "stay at root" (`return response` on line 40). It should now redirect to `/clients` instead. **Note**: checking the current code (line 53), the middleware already redirects authenticated coaches on the login page to `/clients` — only line 40 needs updating.

**Files**:
- `src/middleware.ts`:
  - Line 40: change `if (role === 'coach') return response; // coach home IS root`
    → `if (role === 'coach') return NextResponse.redirect(new URL('/clients', request.url));`
  - Remove the comment `// coach home IS root`

**Dependencies**: None (can run independently within Phase 4)

**Acceptance Criteria**:
- [ ] Visiting `/` as a coach redirects to `/clients`
- [ ] Visiting `/` as a client still redirects to `/dashboard`
- [ ] Visiting `/` while unauthenticated still redirects to `/login`
- [ ] No other middleware logic changed

**Estimated Effort**: Small (< 30 min)

---

### Task 4.3: Delete `src/app/page.tsx`

**Description**: The root `page.tsx` is the old coach home page (client list without auth). After the routing changes, the middleware intercepts all requests to `/` before they reach this page. Deleting it removes dead code and prevents accidental direct access.

**Files**:
- `src/app/page.tsx` — DELETE this file

**Dependencies**: Tasks 4.1 and 4.2 (routing must be in place first)

**Acceptance Criteria**:
- [ ] `src/app/page.tsx` no longer exists
- [ ] No 404 error when navigating to `/` as an authenticated coach (middleware redirects before Next.js tries to render)
- [ ] Application still works for all roles

**Estimated Effort**: Small (< 30 min)

---

## Phase 5: Dashboard UI

> Depends on all prior phases. Build from data outward: data fetching → layout → components.

---

### Task 5.1: Create `src/app/(dashboard)/clients/page.tsx` (Server Component)

**Description**: Create the main coach dashboard page as a proper Server Component. Fetches coach identity from session, loads clients via `getClientsByCoachId()`, and composes the layout from subcomponents.

**Files**:
- `src/app/(dashboard)/clients/page.tsx` — new file replacing implied placeholder:
  ```ts
  // Server Component — no 'use client'
  import { authProvider } from '@/lib/registry'
  import { getCoachByAuthId } from '@/app/actions/coachActions'
  import { getClientsByCoachId } from '@/app/actions/clientActions'
  // Import: CoachHeader, MetricsSection, ClientRosterSection

  export default async function ClientsPage() {
    const session = await authProvider.getSession()
    // if no session → handled by middleware
    const coach = await getCoachByAuthId(session!.user.id)
    if (!coach) {
      // Render error state — do NOT redirect (per design decision)
      return <CoachProfileMissingError />
    }
    const clients = await getClientsByCoachId(coach.id)
    return (
      <main>
        <CoachHeader coachName={coach.name} />
        <MetricsSection clients={clients} />
        <ClientRosterSection clients={clients} />
      </main>
    )
  }
  ```

**Dependencies**: Tasks 3.1, 4.1, 4.2 (routing must work; `getClientsByCoachId` already exists in `clientActions.ts`)

**Acceptance Criteria**:
- [ ] Page is a Server Component (no `'use client'`)
- [ ] Uses `getClientsByCoachId()` — never `getClients()`
- [ ] Handles missing Coach doc with error render (not redirect)
- [ ] Passes typed props to all child components
- [ ] TypeScript compiles

**Estimated Effort**: Medium (30 min - 1 hour)

---

### Task 5.2: Create `CoachHeader` component

**Description**: Client Component that renders the top header bar with the coach's name, a greeting, and a "Invite Client" button that links to `/clients/new`.

**Files**:
- `src/components/coach/CoachHeader.tsx` — new file:
  - Props: `{ coachName: string }`
  - `'use client'` directive
  - Shows: "Hola, {coachName}" heading + subtitle
  - Primary action button: "Invitar Cliente" → `href="/clients/new"`
  - Secondary action: "Invitar Coach" → `href="/coaches/new"`
  - MUI `AppBar` or custom header layout, dark theme consistent with existing UI

**Dependencies**: Task 5.1 (page must exist to know what props are needed)

**Acceptance Criteria**:
- [ ] Renders coach name
- [ ] Both invite buttons navigate to correct routes
- [ ] Visually consistent with dark theme (same palette as `src/app/page.tsx`)
- [ ] TypeScript props typed

**Estimated Effort**: Small (< 30 min)

---

### Task 5.3: Create `MetricsSection` component

**Description**: Server Component that receives client data and renders 3 `MetricCard` subcomponents: Active Clients (real count), Pending Plans (real — clients with 0 plans), Avg Completion (mocked at 0% with "coming soon" label).

**Files**:
- `src/components/coach/MetricsSection.tsx` — new file:
  - Props: `{ clients: (Client & { id: string })[] }`
  - No `'use client'` — pure presentational server component
  - Computes:
    - `activeClients = clients.length`
    - `pendingPlans = clients.filter(c => c.plans.length === 0).length`
    - `avgCompletion = 0` (mocked)
  - Renders 3 `<MetricCard>` in a responsive grid (MUI `Grid` or CSS grid)

**Dependencies**: Task 5.1

**Acceptance Criteria**:
- [ ] Receives `clients` array prop
- [ ] `activeClients` and `pendingPlans` are computed from real data
- [ ] `avgCompletion` is 0 with a "próximamente" or similar label
- [ ] Responsive layout (3 cols on desktop, stacked on mobile)

**Estimated Effort**: Small (< 30 min)

---

### Task 5.4: Create `MetricCard` component

**Description**: Client Component (for hover/animation effects) displaying a single metric with label, value, and icon. Reusable across all 3 metrics.

**Files**:
- `src/components/coach/MetricCard.tsx` — new file:
  - Props: `{ label: string; value: string | number; icon: React.ReactNode; note?: string }`
  - `'use client'` if animations needed, otherwise can be a Server Component
  - Glass card style matching existing `glassCard` pattern from `src/app/page.tsx`
  - `note` prop renders as small muted text below value (used for "próximamente")

**Dependencies**: Task 5.3

**Acceptance Criteria**:
- [ ] Accepts `label`, `value`, `icon`, optional `note`
- [ ] Glass card visual style consistent with rest of app
- [ ] TypeScript props typed and strict
- [ ] No hardcoded data — all from props

**Estimated Effort**: Small (< 30 min)

---

### Task 5.5: Create `ClientRosterSection` component

**Description**: Wrapper Server Component that receives the clients array and renders the `ClientRosterTable` within a titled section container.

**Files**:
- `src/components/coach/ClientRosterSection.tsx` — new file:
  - Props: `{ clients: (Client & { id: string })[] }`
  - No `'use client'`
  - Section heading: "Mis Clientes"
  - "Invitar Cliente" secondary link
  - Renders `<ClientRosterTable clients={clients} />`
  - Empty state: if `clients.length === 0`, show friendly empty state message

**Dependencies**: Task 5.1

**Acceptance Criteria**:
- [ ] Section renders with heading
- [ ] Empty state visible when no clients
- [ ] Delegates table rendering to `ClientRosterTable`
- [ ] TypeScript compiles

**Estimated Effort**: Small (< 30 min)

---

### Task 5.6: Create `ClientRosterTable` component

**Description**: Client Component implementing the sortable, paginated client table. 10 rows per page, client-side sort on Name and Plans columns, row click navigates to `/clients/{id}`.

**Files**:
- `src/components/coach/ClientRosterTable.tsx` — new file:
  - `'use client'`
  - Props: `{ clients: (Client & { id: string })[] }`
  - State: `sortColumn` ('name' | 'plans'), `sortDirection` ('asc' | 'desc'), `page` (number)
  - Columns: Name, Plans count, Target Weight (optional), Actions (view button)
  - MUI `Table` or custom table, dark theme
  - Row click → `router.push('/clients/{id}')`
  - Renders `<TablePagination>` at the bottom
  - `PAGE_SIZE = 10` constant

**Dependencies**: Task 5.5 (section must exist first conceptually; can be built in parallel with 5.5 in practice)

**Acceptance Criteria**:
- [ ] Displays all client data correctly
- [ ] Clicking a column header toggles sort asc/desc
- [ ] Pagination works (10 rows/page)
- [ ] Row click navigates to client detail page
- [ ] Empty state not needed here (handled by `ClientRosterSection`)
- [ ] TypeScript props typed strictly

**Estimated Effort**: Medium (30 min - 1 hour)

---

### Task 5.7: Create `TablePagination` component

**Description**: Client Component for pagination controls used by `ClientRosterTable`. Renders page info and prev/next buttons.

**Files**:
- `src/components/coach/TablePagination.tsx` — new file:
  - `'use client'`
  - Props: `{ page: number; totalPages: number; onPageChange: (page: number) => void }`
  - Shows: "Página X de Y" + Prev / Next buttons
  - Prev disabled on page 1, Next disabled on last page
  - Can use MUI `Pagination` component or custom implementation

**Dependencies**: Task 5.6 (used by ClientRosterTable)

**Acceptance Criteria**:
- [ ] Prev/Next buttons work correctly
- [ ] Buttons disabled at boundaries
- [ ] Page indicator accurate
- [ ] Callback `onPageChange` invoked with correct page number
- [ ] TypeScript props typed

**Estimated Effort**: Small (< 30 min)

---

## Phase 6: Cleanup

> Run after all phases above are complete and verified.

---

### Task 6.1: Remove `NEXT_PUBLIC_DEFAULT_COACH_ID` from `Creator.tsx`

**Description**: `Creator.tsx` passes `NEXT_PUBLIC_DEFAULT_COACH_ID` as `coachId` to `SavePlanModal`. This needs to be replaced with a session-based lookup. This is a separate cleanup from the actions change in Task 3.1.

**Files**:
- `src/components/creator/Creator.tsx` — line 285:
  - Remove `coachId={process.env.NEXT_PUBLIC_DEFAULT_COACH_ID ?? ''}`
  - `Creator` is a Client Component — it cannot call `authProvider.getSession()` directly
  - Solution: pass `coachId` as a prop from the parent Server Component (`src/app/creator/page.tsx`), which can call `authProvider.getSession()` → `getCoachByAuthId()` → `coach.id`
  - Update `Creator.tsx` props interface to accept `coachId: string`
  - Update `src/app/creator/page.tsx` to fetch coachId and pass it down

**Dependencies**: All prior phases (ensures session-based identity chain is established)

**Acceptance Criteria**:
- [ ] No `process.env.NEXT_PUBLIC_DEFAULT_COACH_ID` reference in `Creator.tsx`
- [ ] `coachId` flows from server → Creator as a prop
- [ ] `creator/page.tsx` handles missing Coach doc with error state
- [ ] Plan saving still works end-to-end

**Estimated Effort**: Medium (30 min - 1 hour)

---

### Task 6.2: Remove `NEXT_PUBLIC_DEFAULT_COACH_ID` from `.env.example` and `scripts/seed-coach.ts`

**Description**: Remove the env var from the example env file and update the seed script to no longer instruct users to set it.

**Files**:
- `.env.example` — remove the `NEXT_PUBLIC_DEFAULT_COACH_ID=` line
- `scripts/seed-coach.ts` — lines 42 and 56: remove the `console.log` instruction to set the env var. Update the output to instead say the coach is seeded and their `authId` must be set separately if needed.

**Dependencies**: Task 6.1 (confirm no code uses the var before removing from docs)

**Acceptance Criteria**:
- [ ] `.env.example` has no reference to `NEXT_PUBLIC_DEFAULT_COACH_ID`
- [ ] `scripts/seed-coach.ts` output no longer mentions the env var
- [ ] Seed script still works and outputs useful info

**Estimated Effort**: Small (< 30 min)

---

### Task 6.3: Final verification — confirm no remaining env var references in app code

**Description**: Grep the `src/` directory for any remaining `NEXT_PUBLIC_DEFAULT_COACH_ID` references and verify they are all gone.

**Files**: N/A — verification task

**Steps**:
```
rg "NEXT_PUBLIC_DEFAULT_COACH_ID" src/
```
Expected result: zero matches.

**Dependencies**: Tasks 6.1 and 6.2

**Acceptance Criteria**:
- [ ] Zero matches for `NEXT_PUBLIC_DEFAULT_COACH_ID` in `src/`
- [ ] Zero matches in `emails/`
- [ ] `openspec/` references are acceptable (historical docs)
- [ ] `scripts/` references removed per Task 6.2

**Estimated Effort**: Small (< 30 min)

---

## Summary

| Phase | Tasks | Description | Effort |
|-------|-------|-------------|--------|
| Phase 1 | 3 | Auth port + adapter + createCoach fix | ~1 hour |
| Phase 2 | 2 | Email template rename + new coach template | ~30 min |
| Phase 3 | 3 | inviteClient session fix + inviteCoach action + page | ~1.5 hours |
| Phase 4 | 3 | Login redirect + middleware + delete page.tsx | ~30 min |
| Phase 5 | 7 | Full dashboard UI (page + 6 components) | ~3.5 hours |
| Phase 6 | 3 | Env var cleanup + Creator.tsx fix | ~1 hour |
| **Total** | **21** | | **~8 hours** |

### Key Discoveries (from code audit)

1. **Middleware already partially updated** — line 53 already redirects authenticated coaches to `/clients` on the login page. Only line 40 (root redirect) still needs the `return response` → `redirect('/clients')` fix.

2. **`Creator.tsx` also uses the env var** — not mentioned in the design but found in code audit. Task 6.1 covers this as a separate cleanup requiring a prop-drilling fix from `creator/page.tsx`.

3. **`getClientsByCoachId()` already exists** — `src/app/actions/clientActions.ts` already has this function. The dashboard page simply needs to use it instead of `getClients()`.

4. **`src/app/(dashboard)/clients/page.tsx` does not yet exist** — the route group exists (via `clients/new/`) but there is no `clients/page.tsx`. Task 5.1 creates it fresh.

5. **No migration needed** — the single coach in DB already has `authId` set per user note.
