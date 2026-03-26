## Context

The current `update-password` screen fails to properly update passwords and uses an outdated UI that does not align with the new application theme. Furthermore, it treats all visitors identically, lacking the ability to differentiate between a user setting a new password via an invite/recovery link (where they only need to provide a new password) versus an active user wanting to change their password manually (where verifying the current password is required for security).

## Goals / Non-Goals

**Goals:**
- Implement the premium Stitch UI for the update password screen.
- Create a dual-mode form (Recovery vs Manual) driven by the authentication context.
- Provide clear error and success feedback using the themed `Alert` component.

**Non-Goals:**
- Modifying Supabase Auth email templates.
- Adding password complexity meters or mandatory 2FA.

## Decisions

- **UI Implementation**: Use `update-password.module.css` to translate the Stitch MCP HTML/CSS, maintaining the glassmorphism aesthetic and `Manrope` typography.
- **Mode Detection**: 
  - *Decision*: We will update `src/app/auth/callback/route.ts` to inspect the `type` search parameter passed by Supabase (`magiclink`, `recovery`, or `invite`). 
    - If `type === 'recovery'` or `type === 'invite'`, we redirect to `/update-password?type=recovery`.
    - If `type === 'magiclink'`, we redirect to `/` (the app root / dashboard) or the specified `next` parameter, effectively skipping the password update page.
    - The `update-password` page will read the `?type` search parameter to render the "Recovery/Invite Mode" (hiding the Current Password field). If absent, standard "Manual Update" mode is rendered for active users.
- **Form State Management**: The Next.js Server Action (`updatePasswordAction`) will accept an optional `currentPassword`. If provided, it will attempt to re-authenticate the user first using `signInWithPassword` to verify the old password before calling `updateUser({ password: newPassword })`.

## Risks / Trade-offs

- **Risk**: A user in recovery mode navigates away and loses the `?type=recovery` URL parameter, then tries to update their password but is prompted for their old password (which they forgot).
  - *Mitigation*: The recovery session is still active. The user can just click the email link again. Keeping the state in the URL search params is stateless and resilient.
