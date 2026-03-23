## Why

The current authentication flows (login, update password, magic link, logout) lack the premium visual aesthetics designed in Stitch. To provide a high-quality experience for users, and pay down the technical UX debt originated in the original auth implementation, we need to update these views to accurately match the beautiful "Web Login Screen" and "Web Change Password" Stitch designs. Additionally, the end-to-end UX flow must seamlessly handle Supabase states (magic links, sessions, error handling) while looking great.

## What Changes

- **Web Login Screen**: Implement the Stitch layout, featuring modern typography, rich colors, and dynamic interactive states (hover, focus, micro-animations).
- **Update Password Screen**: Implement the "Web Change Password" UI to guide the user in setting their password right after accessing via magic link or callback.
- **Complete auth UX Flows**: Assure that all Supabase error scenarios (invalid links, wrong passwords) have proper visually-appealing error messages instead of generic unstyled text.
- **Magic Link improvements**: Upgrade the magic link requested state UI, handling the feedback clearly.
- **Logout behavior**: Make the logout process seamless with a proper loading UI and smooth redirect.
- **Global Typography**: Integrate the `Manrope` font as the global default application font, affecting both authorized and unauthorized sections.

## Capabilities

### New Capabilities
- `ui-theme`: Centralizing the global typography (Manrope font) and core app-wide theme metrics.
- `auth-ux`: Centralizing the logic and styles specifically for the Authentication user experience (Login, Update Password, Magic Link feedbacks, Logout).

### Modified Capabilities
- `user-auth`: Updating the requirements to mandate strict adherence to the Stitch UI metrics and error handling feedback. 

## Impact

- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/update-password/page.tsx`
- `src/app/auth/callback/route.ts` (if any UX redirects are modified)
- `src/middleware.ts` (to redirect unauthenticated root access to login)
- `src/app/layout.tsx` (to inject the global Manrope font)
- Global style variables and CSS modules potentially added to match the Stitch Theme.
- Supabase auth components and callbacks.
