# Spec: Data Access & Security

## Context

The current coach home calls `getClients()` which executes `ClientModel.find()` with no filter — every coach sees every client in the database. This is a data isolation bug. The fix requires two steps: (1) resolve the current coach's MongoDB `_id` from the Supabase session `authId`, and (2) use `getClientsByCoachId(coachId)` instead of `getClients()`. Both server actions already exist; the spec governs how they must be composed and what invariants must hold.

Additionally, the `inviteClient` Server Action currently reads `NEXT_PUBLIC_DEFAULT_COACH_ID` from the environment to assign the new client's coach. This must be replaced with the authenticated coach's actual ID from the session.

---

## Requirements

- **Req 1**: The `/clients` dashboard page must resolve the current coach identity by calling `getCoachByAuthId(session.user.id)` — where `session` comes from `authProvider.getSession()`.
- **Req 2**: The `/clients` dashboard page must fetch clients by calling `getClientsByCoachId(coach.id)`. The unfiltered `getClients()` must NOT be used in any coach-facing dashboard path.
- **Req 3**: If `getCoachByAuthId()` returns `null` (coach record not found for the authenticated user), the page must render an error state and log the anomaly — it must NOT proceed to fetch clients.
- **Req 4**: The `inviteClient` Server Action must resolve the current coach's ID from the session (via `authProvider.getSession()` → `getCoachByAuthId(session.user.id)`) instead of reading `NEXT_PUBLIC_DEFAULT_COACH_ID`.
- **Req 5**: The `NEXT_PUBLIC_DEFAULT_COACH_ID` environment variable must be removed from usage after Req 4 is implemented.
- **Req 6**: No coach must be able to read, modify, or reference clients belonging to another coach — this must be enforced at the data-fetching layer (server action / DB query), not solely at the UI layer.
- **Req 7**: All data-fetching for the dashboard must occur in Server Components or Server Actions — no client-side fetching of raw client data.

---

## Scenarios

1. **Scenario: Coach views their own client list**
   - Given: Coach A has 3 clients; Coach B has 2 different clients
   - When: Coach A navigates to `/clients`
   - Then:
     - `getCoachByAuthId(coachA.authId)` returns `coachA`
     - `getClientsByCoachId(coachA.id)` returns exactly 3 clients
     - The rendered table shows 3 rows — none belonging to Coach B

2. **Scenario: Coach B cannot see Coach A's clients**
   - Given: Coach A has clients; Coach B is authenticated
   - When: Coach B navigates to `/clients`
   - Then:
     - `getClientsByCoachId(coachB.id)` returns only Coach B's clients
     - Coach A's clients are never included in the response
     - No filtering at the UI layer is required (isolation happens at the DB query)

3. **Scenario: Authenticated coach record not found in DB**
   - Given: A user with `role === 'coach'` in Supabase but no matching `Coach` document in MongoDB (e.g., migration gap)
   - When: The coach navigates to `/clients`
   - Then:
     - `getCoachByAuthId(session.user.id)` returns `null`
     - The page renders an error state: "Coach profile not found. Contact your administrator."
     - No client data is fetched
     - The error is logged server-side with the `authId` for diagnostics

4. **Scenario: New client is assigned to the correct coach**
   - Given: Coach A is authenticated and submits the invite client form
   - When: `inviteClient` Server Action executes
   - Then:
     - The action resolves Coach A's ID via `getCoachByAuthId(session.user.id)`
     - The new `Client` document is created with `coachId` set to Coach A's MongoDB `_id`
     - `NEXT_PUBLIC_DEFAULT_COACH_ID` is NOT referenced

5. **Scenario: Client invite fails coach identity resolution**
   - Given: Coach A is authenticated but their Coach DB document is missing
   - When: Coach A submits the invite client form
   - Then:
     - `getCoachByAuthId()` returns `null`
     - The Server Action redirects with an error: `?error=Could not resolve coach identity`
     - No Supabase invite is sent and no Client document is created

6. **Scenario: Unauthenticated request reaches data layer**
   - Given: No active session (e.g., expired token)
   - When: Any data-fetching path is invoked for `/clients`
   - Then:
     - `authProvider.getSession()` returns `null`
     - The middleware has already redirected to `/login` before the page renders
     - Even if the data layer is reached directly, it must not return any client data without a valid session
