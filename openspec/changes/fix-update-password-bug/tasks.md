## 1. Auth Callback Routing

- [x] 1.1 Update `src/app/auth/callback/route.ts` para leer el parámetro `type` (`magiclink`, `recovery`, `invite`). Si es `recovery` o `invite`, redirigir a `/update-password?type=recovery` (o `invite`). Si es `magiclink` o un login normal (PKCE sin `next`), redirigir por defecto a `/` para entrar directo a la app.

## 2. Server Actions Update

- [x] 2.1 Refactor `src/app/(auth)/update-password/actions.ts` to accept an optional `currentPassword` parameter.
- [x] 2.2 Add logic to `updatePasswordAction` to re-authenticate the user via `signInWithPassword` if `currentPassword` is present, verifying it before calling `updateUser`.

## 3. UI Implementation

- [x] 3.1 Overhaul `src/app/(auth)/update-password/update-password.module.css` to match the Stitch MCP design (Glassmorphism, gradients, borders).
- [x] 3.2 Update `src/app/(auth)/update-password/page.tsx` to detect `?type=recovery` in the URL search params.
- [x] 3.3 Implement the dual-mode form: conditionally render the "Current Password" input if not in recovery mode.
- [x] 3.4 Integrate the structured `Alert` component for surfacing success or validation errors.

## 4. Verification

- [ ] 4.1 Manually verify password update from an active user session.
- [ ] 4.2 Manually verify password update via magic link/reset link (Recovery Mode).
