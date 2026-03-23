## Context

The current authentication flows (Login, Update Password) are using basic, minimally styled HTML elements. We have beautiful, premium designs available in our Stitch project ("Create New Diet Plan") specifically for the "Web Login Screen" and "Web Change Password" pages. As part of our V1 goals to offer a premium SaaS experience, it is imperative that our Auth UI accurately reflects these designs and handles Supabase authentication states (magic links, auth callbacks, errors) gracefully with proper UX feedback.

## Goals / Non-Goals

**Goals:**
- Implement the exact visual layout for Login and Change Password from Stitch (Dark mode, Manrope font, #13ec5b accent color).
- Handle Supabase auth errors (invalid credentials, expired magic links) with visually appealing feedback (e.g., styled alerts, not raw text).
- Create a seamless logout experience with visual feedback.

**Non-Goals:**
- We are NOT changing the underlying authentication provider (Supabase Auth remains).
- We are NOT adding new authentication methods (e.g., OAuth, Google Login) at this time.

## Decisions

1. **Styling Approach**: We will implement the Stitch Design Theme metrics.
   - **Global**: The `Manrope` font will be configured as the default font across the entire application (likely via Next.js `next/font/google` in `layout.tsx`).
   - **Auth Scoped**: Specific hex colors (e.g. #13ec5b) and dark mode backgrounds found in the Stitch metadata will be applied to the Auth screens.
2. **Error State Handling**: Instead of raw `<p>` tags for errors, we will build a reusable `Alert` or `Toast` UI component tailored to the new design system to show Supabase errors.
3. **Magic Link Routing**: `auth/callback/route.ts` will be updated to ensure that if a magic link expires or is invalid, the user is redirected cleanly to `/login?error=expired_link` so the UI can catch it and display the styled error.

## Risks / Trade-offs

- **Risk**: Magic link callbacks might fail silently or show an unhandled server error.
  **Mitigation**: Use a robust `try/catch` in the Next.js Route Handler (`auth/callback/route.ts`) and guarantee a fallback redirect to `/login` with an error query parameter.
- **Risk**: The new colors might clash with the dashboard if not scoped correctly.
  **Mitigation**: The `(auth)` route group will use its own layout or specific CSS classes to restrict the heavy dark mode overrides to the auth pages, while letting the global `Manrope` font flow naturally into the rest of the application.
