# Spec: Coach Dashboard Route & Redirect

## Context

The current middleware (`src/middleware.ts`) already implements RBAC routing but has one gap: when `role === 'coach'` and `pathname === '/'`, it lets the request pass through (`return response`) instead of redirecting to `/clients`. Additionally, `src/app/page.tsx` acts as the de-facto coach home but must be removed once `/clients` is the canonical route.

---

## Requirements

- **Req 1**: A coach who logs in must land on `/clients`, not `/`.
- **Req 2**: Root `/` must always redirect — never render content — based on auth state and role:
  - Unauthenticated → `/login`
  - `role === 'coach'` → `/clients`
  - `role === 'client'` → `/dashboard`
  - Unknown role → `/login?error=Unknown+role.+Contact+your+administrator.`
- **Req 3**: `src/app/page.tsx` must be removed; the root path must have no page component.
- **Req 4**: Coaches must be blocked from accessing `/dashboard` (client-portal); clients must be blocked from `/clients` (coach area). Both blocks already exist in middleware and must be preserved.
- **Req 5**: Unauthenticated users visiting any protected route are redirected to `/login`.
- **Req 6**: Auth callback (`/auth/callback`) and update-password (`/update-password`) routes remain unblocked regardless of auth state.

---

## Scenarios

1. **Scenario: Coach completes login**
   - Given: A user with `role === 'coach'` successfully authenticates via Supabase
   - When: The login form's Server Action resolves and the auth redirect is processed by middleware
   - Then: The user lands on `/clients`

2. **Scenario: Coach visits root directly**
   - Given: A user with `role === 'coach'` and a valid session navigates to `/`
   - When: The middleware processes the request
   - Then: The middleware issues a `302` redirect to `/clients`; no page is rendered at `/`

3. **Scenario: Client visits root directly**
   - Given: A user with `role === 'client'` and a valid session navigates to `/`
   - When: The middleware processes the request
   - Then: The middleware redirects to `/dashboard`

4. **Scenario: Unauthenticated user visits root**
   - Given: No active session
   - When: The user navigates to `/`
   - Then: The middleware redirects to `/login`

5. **Scenario: Unauthenticated user visits protected route**
   - Given: No active session
   - When: The user navigates to `/clients` or `/dashboard`
   - Then: The middleware redirects to `/login`

6. **Scenario: Coach tries to access client-portal**
   - Given: A user with `role === 'coach'` and a valid session
   - When: The user navigates to `/dashboard`
   - Then: The middleware redirects to `/clients`

7. **Scenario: Client tries to access coach area**
   - Given: A user with `role === 'client'` and a valid session
   - When: The user navigates to `/clients`
   - Then: The middleware redirects to `/dashboard`

8. **Scenario: User with unknown role logs in**
   - Given: A user whose `user_metadata.role` is not `'coach'` or `'client'`
   - When: The middleware processes any route
   - Then: The user is redirected to `/login?error=Unknown+role.+Contact+your+administrator.`
