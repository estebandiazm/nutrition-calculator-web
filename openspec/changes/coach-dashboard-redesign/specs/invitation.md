# Spec: Coach Invitation Flow

## Context

The current `AuthProvider` port defines `inviteUser(email: string)` with no role parameter, and `SupabaseAuthProvider` hardcodes `data: { role: 'client' }` when calling `admin.inviteUserByEmail()`. A single email template (`InviteUserEmail`) is used for all invites. This makes it impossible to invite coaches through the platform. The fix parameterizes the role and adds a dedicated coach email template.

---

## Requirements

- **Req 1**: `AuthProvider.inviteUser` must accept a `role` parameter: `inviteUser(email: string, role: Role): Promise<{ id: string } | null>`.
- **Req 2**: `SupabaseAuthProvider.inviteUser` must pass the received `role` value into Supabase's `admin.inviteUserByEmail()` user metadata (`data: { role }`).
- **Req 3**: A new email template `InviteCoachEmail` must exist at `emails/InviteCoachEmail.tsx` with coach-specific copy (different from the client template which says "Tu nutricionista te ha invitado").
- **Req 4**: The existing `InviteUserEmail` template must be renamed to `InviteClientEmail` for clarity; its copy and behavior remain unchanged.
- **Req 5**: A new Server Action `inviteCoach(formData: FormData)` must:
  1. Call `authProvider.inviteUser(email, 'coach')`
  2. Create a `Coach` entity in MongoDB via `createCoach({ name, email })`
  3. Link the Supabase `authId` to the created Coach document
  4. Redirect to a success state on completion
- **Req 6**: The existing `inviteClient` action must be updated to call `authProvider.inviteUser(email, 'client')` (explicit role instead of relying on hardcoded default).
- **Req 7**: Supabase must receive the correct template for each role. Coach invites must trigger the `InviteCoachEmail` template; client invites must trigger the `InviteClientEmail` template. This is configured in the Supabase dashboard (email template mapping) — the implementation specifies which template key to use.
- **Req 8**: Both invite flows must handle the error case where Supabase returns an error (e.g., email already registered) and surface it to the caller without crashing.

---

## Scenarios

1. **Scenario: Coach invites a new client**
   - Given: A coach is authenticated and navigates to `/clients/new`
   - When: The coach fills in the client's name and email, then submits the form
   - Then:
     - `inviteUser(email, 'client')` is called on the `AuthProvider`
     - Supabase sends an invite email using the `InviteClientEmail` template
     - A new `Client` document is created in MongoDB with `coachId` set to the current coach's ID
     - The coach is redirected to `/clients?success=Client invited successfully`

2. **Scenario: Coach invites a new coach**
   - Given: A coach (or admin) is authenticated and accesses the coach invite flow
   - When: The form is submitted with the new coach's name and email
   - Then:
     - `inviteUser(email, 'coach')` is called on the `AuthProvider`
     - Supabase sends an invite email using the `InviteCoachEmail` template
     - A new `Coach` document is created in MongoDB (without `authId` initially)
     - Once the invited coach completes account activation, their `authId` is linked to the Coach document
     - The inviting coach is redirected to a success state

3. **Scenario: Invited client receives correct email**
   - Given: A client invite was successfully submitted
   - When: The client checks their inbox
   - Then:
     - The email subject and preview reference FitMetrik client onboarding
     - The email body does NOT contain coach-specific copy
     - The activation link redirects through `/auth/callback`

4. **Scenario: Invited coach receives correct email**
   - Given: A coach invite was successfully submitted
   - When: The new coach checks their inbox
   - Then:
     - The email subject and preview reference the coach onboarding or platform access
     - The email body does NOT contain client-specific copy ("Tu nutricionista te ha invitado" must NOT appear)
     - The activation link redirects through `/auth/callback`

5. **Scenario: Invite fails because email already exists**
   - Given: An email address that is already registered in Supabase
   - When: Either `inviteClient` or `inviteCoach` is called with that email
   - Then:
     - `AuthProvider.inviteUser` returns `null`
     - The calling Server Action redirects with an error query param (e.g., `?error=Failed to invite user via Auth Provider`)
     - No duplicate DB document is created

6. **Scenario: Missing SERVICE_ROLE_KEY in environment**
   - Given: `SUPABASE_SERVICE_ROLE_KEY` is not set in the environment
   - When: Any invite action is triggered
   - Then:
     - `SupabaseAuthProvider.inviteUser` logs the error and returns `null`
     - The Server Action surfaces an error to the user without crashing
