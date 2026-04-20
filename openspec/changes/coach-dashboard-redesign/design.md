# Design: Coach Dashboard Redesign & Invitation System

## Architecture Overview

```
                    ┌──────────────────────────┐
                    │       Middleware          │
                    │  (role-based redirects)   │
                    └─────────┬────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  /login      │ │  /clients    │ │  /dashboard   │
    │  (auth)      │ │  (coach)     │ │  (client)     │
    └──────┬───────┘ └──────┬───────┘ └──────────────┘
           │                │
           │    ┌───────────┴────────────────┐
           │    │  Server Component           │
           │    │  getSession → getCoachBy    │
           │    │  AuthId → getClientsByCoach │
           │    └───────────┬────────────────┘
           │                │
           │    ┌───────────┴────────────────┐
           │    │  Client Components          │
           │    │  MetricCards, ClientTable,   │
           │    │  CoachSidebar, CoachHeader   │
           │    └────────────────────────────┘
           │
    ┌──────┴───────────────────────────────────┐
    │  Server Actions                           │
    │  inviteClient(email, 'client')            │
    │  inviteCoach(email, 'coach')              │
    └──────┬───────────────────────────────────┘
           │
    ┌──────┴───────────────────────────────────┐
    │  AuthProvider Port                        │
    │  inviteUser(email, role) → Supabase Admin │
    └──────────────────────────────────────────┘
```

---

## 1. Routing Changes

### Current State

| File | Line | Current Behavior |
|------|------|-----------------|
| `src/app/(auth)/login/actions.ts` | 7 | `getRedirectUrl('coach')` returns `'/'` |
| `src/middleware.ts` | 40 | `if (role === 'coach') return response` (coach home IS root) |
| `src/app/page.tsx` | — | `'use client'` component fetching ALL clients via `getClients()` |

### Proposed State

| File | Line | New Behavior |
|------|------|-------------|
| `src/app/(auth)/login/actions.ts` | 7 | `getRedirectUrl('coach')` returns `'/clients'` |
| `src/middleware.ts` | 40 | `if (role === 'coach') return NextResponse.redirect(new URL('/clients', request.url))` |
| `src/app/page.tsx` | — | **DELETE** this file entirely |

### Detailed Changes

**`src/app/(auth)/login/actions.ts`** (line 7):
```typescript
// BEFORE
if (role === 'coach') return '/';
// AFTER
if (role === 'coach') return '/clients';
```

**`src/middleware.ts`** (line 40):
```typescript
// BEFORE
if (role === 'coach') return response; // coach home IS root
// AFTER
if (role === 'coach') return NextResponse.redirect(new URL('/clients', request.url));
```

**`src/app/page.tsx`**: Delete entirely. No root page needed -- middleware handles all redirects before Next.js resolves a route component.

---

## 2. UI Component Structure

### New Route File

**`src/app/(dashboard)/clients/page.tsx`** — Server Component (new file)

This is the coach's home page. It fetches data server-side and delegates rendering to client components.

### Component Tree

```
src/app/(dashboard)/clients/page.tsx (Server Component — data fetching)
└── <ClientsDashboardPage> (presentational wrapper)
    ├── <CoachHeader />                          src/components/coach/CoachHeader.tsx (Client)
    │   ├── Logo + App name
    │   ├── Search input (future — render disabled for now)
    │   └── Profile avatar + LogoutButton
    │
    ├── <main> layout wrapper (flex row)
    │   ├── <CoachSidebar />                     src/components/coach/CoachSidebar.tsx (Client)
    │   │   ├── NavItem: "Clients" (active)
    │   │   ├── NavItem: "Diet Plans" (disabled/future)
    │   │   ├── NavItem: "Analytics" (disabled/future)
    │   │   └── NavItem: "Settings" (disabled/future)
    │   │
    │   └── <section> content area
    │       ├── <MetricsSection>                 src/components/coach/MetricsSection.tsx (Server)
    │       │   └── <MetricCard /> × 3           src/components/coach/MetricCard.tsx (Client)
    │       │       ├── "Active Clients" — count of clients
    │       │       ├── "Pending Plans" — count of clients with 0 plans
    │       │       └── "Avg. Completion" — 0% (mocked, future)
    │       │
    │       ├── <ClientRosterSection>            src/components/coach/ClientRosterSection.tsx (Client)
    │       │   ├── Section header ("Client List" + "Add Client" button)
    │       │   ├── <ClientRosterTable>          src/components/coach/ClientRosterTable.tsx (Client)
    │       │   │   ├── <thead> — sortable column headers
    │       │   │   ├── <tbody> — client rows (paginated)
    │       │   │   └── <tfoot> — pagination controls
    │       │   └── <EmptyState />               (inline or separate — shown when 0 clients)
    │       │       ├── Illustration placeholder
    │       │       └── "Invite your first client" CTA
    │       │
    │       └── (future: quick actions, recent activity)
```

### New Directory

All new components go under `src/components/coach/`. This follows the existing pattern (`src/components/dashboard/`, `src/components/creator/`, etc.).

### Files Created

| File | Type | Purpose |
|------|------|---------|
| `src/app/(dashboard)/clients/page.tsx` | Server Component | Route entry — fetches coach + clients, renders layout |
| `src/components/coach/CoachHeader.tsx` | Client Component | Top bar with logo, search placeholder, profile/logout |
| `src/components/coach/CoachSidebar.tsx` | Client Component | Left nav with route links |
| `src/components/coach/MetricCard.tsx` | Client Component | Single metric card (icon, label, value) |
| `src/components/coach/MetricsSection.tsx` | Server Component | Wraps 3 MetricCards, calculates values from data |
| `src/components/coach/ClientRosterSection.tsx` | Client Component | Table section wrapper with header + "Add Client" button |
| `src/components/coach/ClientRosterTable.tsx` | Client Component | Sortable, paginated table |

### Styling Approach

- Dark theme: `bg-[#0a0f1e]` as page background (Tailwind v4)
- MUI 7 components for Table, Cards, Buttons (consistent with existing codebase)
- Tailwind for layout, spacing, colors
- No new ThemeProvider needed — reuse existing `darkTheme` from `src/themes/`

---

## 3. Data Flow

### Server Component Data Fetching

```
GET /clients (Server Component renders)
  │
  ├─ authProvider.getSession()
  │   └─ Returns: AuthSession { user: { id, email, role } }
  │   └─ Null? → redirect('/login')
  │   └─ role !== 'coach'? → redirect('/login') (defensive — middleware should catch)
  │
  ├─ getCoachByAuthId(session.user.id)
  │   └─ Returns: Coach & { id } | null
  │   └─ Null? → render error state: "Coach profile not found. Contact your administrator."
  │              + console.error server-side log
  │              DO NOT fetch clients, DO NOT redirect (let coach see the error)
  │
  ├─ getClientsByCoachId(coach.id)
  │   └─ Returns: (Client & { id })[]
  │   └─ Already filtered by coachId at DB query layer
  │
  └─ Compute metrics:
      ├─ activeClients = clients.length
      ├─ pendingPlans = clients.filter(c => c.plans.length === 0).length
      └─ avgCompletion = 0 (mocked — future feature)
```

### Important: Do NOT use `getClients()`

The unfiltered `getClients()` in `src/app/actions/clientActions.ts` (line 51) must NOT be called from the dashboard path. Always use `getClientsByCoachId()` (line 84).

---

## 4. API & Port Changes

### AuthProvider Interface

**File**: `src/infrastructure/ports/AuthProvider.ts` (line 30)

```typescript
// BEFORE
inviteUser(email: string): Promise<{ id: string } | null>;

// AFTER
inviteUser(email: string, role?: Role): Promise<{ id: string } | null>;
```

The `role` parameter defaults to `'client'` for backward compatibility. The `Role` type is already defined in the same file (line 1): `export type Role = 'coach' | 'client'`.

### SupabaseAuthProvider Adapter

**File**: `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts`

**Line 47** — method signature:
```typescript
// BEFORE
async inviteUser(email: string): Promise<{ id: string } | null> {
// AFTER
async inviteUser(email: string, role: Role = 'client'): Promise<{ id: string } | null> {
```

**Line 70** — metadata injection:
```typescript
// BEFORE
data: { role: 'client' }
// AFTER
data: { role }
```

### Coach Actions — `createCoach` Fix

**File**: `src/app/actions/coachActions.ts` (line 21)

Current `createCoach` only accepts `Pick<Coach, 'name' | 'email'>` — it does NOT accept `authId`. The invite flow needs to link the Supabase auth ID to the Coach doc.

```typescript
// BEFORE
export async function createCoach(
  data: Pick<Coach, 'name' | 'email'>
): Promise<Coach & { id: string }> {
  await dbConnect();
  const doc = await CoachModel.create({
    name: data.name,
    email: data.email,
  });

// AFTER
export async function createCoach(
  data: Pick<Coach, 'name' | 'email'> & Partial<Pick<Coach, 'authId'>>
): Promise<Coach & { id: string }> {
  await dbConnect();
  const doc = await CoachModel.create({
    name: data.name,
    email: data.email,
    authId: data.authId,
  });
```

This mirrors the existing `createClient` signature pattern (line 38 of `clientActions.ts`).

---

## 5. Server Actions — Invitation

### Update `inviteClient`

**File**: `src/app/(dashboard)/clients/new/actions.ts`

Two changes:
1. Pass `role: 'client'` explicitly to `inviteUser`
2. Resolve `coachId` from session instead of env var

```typescript
// BEFORE (line 19)
const authUser = await authProvider.inviteUser(email);

// AFTER
const authUser = await authProvider.inviteUser(email, 'client');
```

```typescript
// BEFORE (lines 26-30) — env var lookup
const defaultCoachId = process.env.NEXT_PUBLIC_DEFAULT_COACH_ID;
if (!defaultCoachId) {
  console.error('Missing NEXT_PUBLIC_DEFAULT_COACH_ID');
  redirect('/clients/new?error=System configuration error');
}

// AFTER — session-based coach resolution
const session = await authProvider.getSession();
if (!session || session.user.role !== 'coach') {
  redirect('/clients/new?error=Unauthorized');
}
const coach = await getCoachByAuthId(session.user.id);
if (!coach) {
  redirect('/clients/new?error=Could not resolve coach identity');
}
const coachId = coach.id;
```

New imports needed: `authProvider` from `@/lib/registry`, `getCoachByAuthId` from `@/app/actions/coachActions`.

### New `inviteCoach` Action

**New file**: `src/app/(dashboard)/coaches/new/actions.ts`

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authProvider } from '@/lib/registry';
import { createCoach } from '@/app/actions/coachActions';

export async function inviteCoach(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;

  if (!email || !name) {
    redirect('/coaches/new?error=Missing required fields');
  }

  // 1. Invite via Supabase with coach role
  const authUser = await authProvider.inviteUser(email, 'coach');
  if (!authUser) {
    redirect('/coaches/new?error=Failed to invite user via Auth Provider');
  }

  // 2. Create Coach doc in MongoDB, linked to auth ID
  await createCoach({ name, email, authId: authUser.id });

  // 3. Success
  revalidatePath('/clients');
  redirect('/clients?success=Coach invited successfully');
}
```

---

## 6. Email Template Changes

### Current State

- `emails/InviteUserEmail.tsx` — single template with client-specific copy ("Tu nutricionista te ha creado una cuenta")
- Used for ALL invites (bug: coaches get client-oriented messaging)

### Proposed Changes

| Action | File | Notes |
|--------|------|-------|
| Rename | `InviteUserEmail.tsx` → `InviteClientEmail.tsx` | Copy unchanged, just rename file + component + export |
| Create | `InviteCoachEmail.tsx` | New template with coach-specific copy |

### `InviteClientEmail.tsx` (renamed from InviteUserEmail)

- Component name: `InviteClientEmail`
- Preview text: "Tu nutricionista te ha invitado a FitMetrik" (unchanged)
- Body copy: "Tu nutricionista te ha creado una cuenta personal..." (unchanged)
- Export: `export default InviteClientEmail` + named export
- PreviewProps: same action URL pattern

### `InviteCoachEmail.tsx` (new)

- Component name: `InviteCoachEmail`
- Preview text: "Has sido invitado a FitMetrik como Coach"
- Body copy: "Has sido invitado a unirte a FitMetrik como Coach. Desde tu panel podras gestionar clientes, planes nutricionales y mas."
- CTA: "Activar mi cuenta" (same as client)
- Same visual structure (dark theme, same Container/Button styles)
- Different content only — no structural changes

### Supabase Email Template Mapping

Supabase invite emails use Go templates. The `emailRedirectTo` and template selection happens at the Supabase project level (Dashboard > Authentication > Email Templates). Two approaches:

**Option A (recommended)**: Use a SINGLE Supabase invite template with conditional copy based on `role` metadata. This avoids needing separate Supabase template configurations.

```
{{ if eq .Data.role "coach" }}
  Has sido invitado a FitMetrik como Coach...
{{ else }}
  Tu nutricionista te ha creado una cuenta...
{{ end }}
```

**Option B**: Use the React Email templates (`InviteClientEmail`, `InviteCoachEmail`) via a custom email sending endpoint (Resend, SendGrid, etc.) instead of Supabase's built-in invite email.

**Decision**: Go with **Option A** for now (simpler, no new infra). The React Email templates serve as design references and for the `npm run email` preview server. If we later add Resend/SendGrid, we switch to Option B.

---

## 7. Data Access & Security

### Current Problem

`src/app/page.tsx` (line 57) calls `getClients()` which executes `ClientModel.find()` with NO coach filter — returns ALL clients across all coaches.

`src/app/(dashboard)/clients/new/actions.ts` (line 26) uses `process.env.NEXT_PUBLIC_DEFAULT_COACH_ID` — hardcoded single-coach assumption.

### Proposed Solution

#### Dashboard Data Isolation

```typescript
// src/app/(dashboard)/clients/page.tsx
export default async function ClientsDashboard() {
  const session = await authProvider.getSession();
  if (!session || session.user.role !== 'coach') {
    redirect('/login');
  }

  const coach = await getCoachByAuthId(session.user.id);
  if (!coach) {
    // Render error state — DO NOT redirect, coach needs to see the message
    return <CoachNotFoundError />;
  }

  const clients = await getClientsByCoachId(coach.id);
  // ... compute metrics, render page
}
```

#### Identity Chain

```
Supabase Auth (JWT) → session.user.id (authId)
  → CoachModel.findOne({ authId }) → coach._id (MongoDB ObjectId)
    → ClientModel.find({ coachId: coach._id }) → Client[] (filtered)
```

This chain ensures:
1. Authentication via Supabase (middleware validates JWT)
2. Coach identity resolved via `authId` → MongoDB lookup
3. Client data filtered at DB query layer (not UI)

#### Env Var Removal

- Remove usage of `NEXT_PUBLIC_DEFAULT_COACH_ID` from `src/app/(dashboard)/clients/new/actions.ts`
- Keep the env var in `.env.local` temporarily (other code may reference it) — add TODO comment
- Final cleanup in a separate PR once all references are removed

---

## 8. Error States

### Coach Not Found

When `getCoachByAuthId()` returns `null` (authenticated user has `role: 'coach'` in Supabase but no matching Coach doc in MongoDB):

```typescript
// Inline in page.tsx or extracted component
function CoachNotFoundError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0f1e]">
      <div className="text-center">
        <h2 className="text-white text-xl font-bold mb-2">
          Coach profile not found
        </h2>
        <p className="text-gray-400">
          Contact your administrator to set up your coach profile.
        </p>
      </div>
    </div>
  );
}
```

Server-side: `console.error('Coach doc not found for authId:', session.user.id)`

### Empty Client List

When `getClientsByCoachId()` returns `[]`:
- All metric cards show 0
- Table body replaced with empty state illustration + "Invite your first client" CTA linking to `/clients/new`

---

## 9. Dependencies & Sequencing

### Must be done in order (dependency chain):

```
Phase 1: Auth Provider changes
  ├── Update AuthProvider port (add role param)
  ├── Update SupabaseAuthProvider adapter (use role param)
  └── Update createCoach to accept authId

Phase 2: Email templates
  ├── Rename InviteUserEmail → InviteClientEmail
  └── Create InviteCoachEmail

Phase 3: Server Actions
  ├── Update inviteClient (explicit role + session-based coachId)
  └── Create inviteCoach action

Phase 4: Routing
  ├── Update login/actions.ts (coach → /clients)
  ├── Update middleware.ts (root redirect for coach)
  └── Delete src/app/page.tsx

Phase 5: Dashboard UI
  ├── Create src/app/(dashboard)/clients/page.tsx (Server Component)
  ├── Create src/components/coach/MetricCard.tsx
  ├── Create src/components/coach/MetricsSection.tsx
  ├── Create src/components/coach/ClientRosterTable.tsx
  ├── Create src/components/coach/ClientRosterSection.tsx
  ├── Create src/components/coach/CoachHeader.tsx
  └── Create src/components/coach/CoachSidebar.tsx
```

Phase 1-3 can be done as one commit (auth + email + actions). Phase 4 (routing) and Phase 5 (UI) depend on Phase 1-3 but could be done in parallel.

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deleting `src/app/page.tsx` breaks existing `/` bookmarks | Coach users see 404 | Middleware already redirects `/` → `/clients` for coach role (line 40 change). No 404 possible — middleware runs before route resolution. |
| Coach identity lookup fails silently | Coach sees blank page | Explicit error state component + `console.error` server log. No redirect loop — render inline error. |
| Auth provider `role` change breaks existing client invites | New clients get wrong role | Default `role` param to `'client'` — backward compatible. Existing `inviteClient` callers work unchanged. |
| `NEXT_PUBLIC_DEFAULT_COACH_ID` removal breaks other code | Runtime error in untested paths | Search codebase for all references before removing. Phase it: replace usage in `inviteClient` first, then grep for remaining references. |
| `getCoachByAuthId` returns null for pre-existing coaches | Coach locked out after migration | Pre-existing coaches may not have `authId` linked. Need a migration step or admin tool to link existing Coach docs to Supabase auth IDs. Document this as a prerequisite. |

---

## 11. Implementation Notes

- **Existing functions**: `getCoachByAuthId()` (coachActions.ts:47), `getClientsByCoachId()` (clientActions.ts:84) — both already exist and work correctly
- **Metrics**: Use real data for Active Clients and Pending Plans; mock Avg Completion as `0%` (future feature requires tracking plan progress)
- **Table pagination**: Client-side state (`useState` for page/sort). Start with 10 rows/page. No server-side pagination needed yet (coach won't have 1000+ clients initially)
- **Table sorting**: Client-side sort on `name` (alphabetical) and `updatedAt` (date). Sort state in `ClientRosterTable` component
- **No new DB models**: `Coach` and `Client` schemas already have all necessary fields. `authId` on Coach is indexed + unique (sparse) — ready for lookups
- **Pre-existing coach migration**: Coaches created before the multi-role feature may not have `authId`. The `getCoachByAuthId` lookup will return `null` for them. An admin script or one-time migration to link `authId` is a PREREQUISITE before deploying this change
- **`getClients()` cleanup**: The unfiltered `getClients()` function in `clientActions.ts` should NOT be deleted yet (may be used by admin tools in the future). Add a `@deprecated` JSDoc annotation pointing to `getClientsByCoachId()` instead

---

## 12. Testing Strategy (reference for apply phase)

| Area | What to Test | How |
|------|-------------|-----|
| Routing | Coach login → `/clients` | E2E: login as coach, assert URL |
| Routing | Root `/` redirects by role | E2E: navigate to `/`, assert redirect |
| Routing | Cross-role blocks | E2E: coach visits `/dashboard` → redirected |
| Data access | Coach sees only their clients | E2E: two coaches, each sees own clients only |
| Component | Metric cards show correct counts | Unit: render MetricsSection with mock data |
| Component | Table sorts by name | Unit: click header, assert row order |
| Component | Table paginates | Unit: 25 items, assert 10 shown, pagination controls |
| Component | Empty state when 0 clients | Unit: render with empty array |
| Invitation | `inviteUser(email, 'coach')` sets role | Unit: mock Supabase, assert metadata |
| Invitation | `inviteClient` uses session coachId | Unit: mock session, assert no env var |
| Email | Coach email has different copy | Visual: `npm run email` preview |
