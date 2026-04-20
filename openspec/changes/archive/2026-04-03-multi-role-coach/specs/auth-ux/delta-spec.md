# Delta Spec: Auth UX

## Change: multi-role-coach

## Modified Requirements

### REQ-AUTH-001: Role value 'coach' replaces 'nutritionist'
**Before**: The `AuthProvider` port and `SupabaseAuthProvider` adapter recognised `'nutritionist'` as the valid role value for nutritionist users. Middleware routed users with role `'nutritionist'` to `/clients`.
**After**: The system SHALL recognise `'coach'` as the valid role value. The `AuthProvider` port SHALL update its role type union to `'coach' | 'client'`. The `SupabaseAuthProvider` SHALL map `user_metadata.role === 'coach'` accordingly. Middleware SHALL route users with role `'coach'` to `/clients`.
**Reason**: Product rename. `'nutritionist'` is dropped entirely — no backward compatibility required (app not in production).

### REQ-AUTH-002: Middleware RBAC routing updated
**Before**: Middleware checked for role `'nutritionist'` to grant access to coach-facing routes (e.g. `/clients`).
**After**: Middleware SHALL check for role `'coach'` to grant access to `/clients` and other coach-facing routes. A user with role `'nutritionist'` SHALL be treated as having an unrecognised role and SHALL be redirected to `/login`.
**Reason**: Role enum change.

## New Requirements

### REQ-AUTH-NEW-001: Login action implements multi-role redirect
The login Server Action (`src/app/(auth)/login/actions.ts`) SHALL read `user_metadata.role` from the Supabase session after successful authentication and redirect to the correct route based on role value. See `unified-login-flow` spec for the full redirect table and error handling rules.

## Removed Requirements

### REQ (role value 'nutritionist' in AuthProvider)
**Removed because**: The `'nutritionist'` role string is replaced by `'coach'` across all layers. No route, middleware check, or type should reference `'nutritionist'` after this change.

## Scenarios (Gherkin)

Feature: Auth UX — role-based routing

  Scenario: Coach role routes to /clients
    Given a Supabase session with user_metadata.role = "coach"
    When the middleware evaluates the session for a coach-facing route
    Then the user is granted access and routed to /clients

  Scenario: Nutritionist role is rejected
    Given a Supabase session with user_metadata.role = "nutritionist"
    When the middleware evaluates the session
    Then the user is redirected to /login (unrecognised role)

  Scenario: Client role routes to /dashboard
    Given a Supabase session with user_metadata.role = "client"
    When the middleware evaluates the session for a client-facing route
    Then the user is granted access and routed to /dashboard

  Scenario: Unauthenticated user redirected to login
    Given no active Supabase session
    When the middleware evaluates a request to any protected route
    Then the user is redirected to /login

  Scenario: AuthProvider type does not include 'nutritionist'
    Given TypeScript strict mode is enabled
    When a developer attempts to assign role = "nutritionist" to an AuthProvider Role type
    Then a TypeScript compilation error is raised
