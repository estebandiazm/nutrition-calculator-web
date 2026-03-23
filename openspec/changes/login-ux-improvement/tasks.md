## 1. Auth Design System Setup
- [x] 1.1 Establish Stitch theme tokens (colors like `#13ec5b`, dark mode backgrounds) in a dedicated auth CSS module.
- [x] 1.2 Configure `Manrope` as the global font via `next/font/google` in `src/app/layout.tsx`.
- [x] 1.3 Create a reusable Auth Layout or container component for standardizing the layout between Login and Update Password screens.
- [x] 1.4 Create a stylized Alert/Toast component for displaying auth errors.

## 2. Login Page UI
- [x] 2.1 Refactor `src/app/(auth)/login/page.tsx` to fully match the Stitch "Web Login Screen".
- [x] 2.2 Re-implement the Magic Link form (email input, submit button) incorporating the new UI.
- [x] 2.3 Integrate the stylized Alert component to handle Supabase magic link errors or specific URL `error` parameters.

## 3. Update Password UI
- [x] 3.1 Refactor `src/app/(auth)/update-password/page.tsx` to match the Stitch "Web Change Password" exact layout.
- [x] 3.2 Implement form validation visuals (e.g. matching passwords, length) with the new typography and styling.

## 4. Auth Callbacks and Logout
- [x] 4.1 Update `src/app/auth/callback/route.ts` to redirect gracefully to `/login?error=expired` when OTP exchange fails.
- [x] 4.2 Verify and restyle the client-side logout action to provide a smooth transition back to the newly styled login page.
- [x] 4.3 Update `src/middleware.ts` to enforce a redirect from the root URL (`/`) to `/login` for unauthenticated sessions.

## 5. Verification
- [x] 5.1 Run existing Playwright E2E tests (`tests/auth.spec.ts`, `tests/invite.spec.ts`) and update any broken locators caused by the UI refactor to ensure CI passes.
