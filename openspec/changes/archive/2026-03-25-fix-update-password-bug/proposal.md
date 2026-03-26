## Why

The current "Update Password" screen lacks the premium visual aesthetics designed in Stitch, using a basic layout that doesn't match the new Login experience. Furthermore, the screen currently fails to properly handle its dual modes of operation: it must flawlessly support both users arriving via a Magic Link/Password Reset (where they just need to set a new password) and authenticated users who wish to manually change their current password (requiring them to enter both their old and new password).

## What Changes

- **Stitch UI Integration**: Implement the "Web Change Password - Unified Style" layout from Stitch, featuring the glassmorphism card, Manrope typography, and the `#13ec5b` (or corresponding) accent colors to perfectly match the recent Login screen updates.
- **Dual-Mode Logic**: Refactor the form and actions to intelligently switch between two states:
  1. *Recovery Mode*: When accessed via a Magic Link, users only provide a `New Password`. 
  2. *Manual Update*: When an active authenticated user navigates to the page to change their password voluntarily, they must provide their `Current Password` to authorize the change.
- **Form Validation & Feedback**: Ensure Supabase error scenarios (like providing an incorrect current password) surface through styled Alert components.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `auth-ux`: Modify the update password screen requirements to mandate adherence to the Stitch UI metrics and enforce the dual-mode password update logic depending on the flow context (Recovery vs Manual).

## Impact

- `src/app/(auth)/update-password/page.tsx` (UI Restyling and Mode Switching logic)
- `src/app/(auth)/update-password/update-password.module.css` (or `globals.css` if reusing existing auth styles)
- `src/app/(auth)/update-password/actions.ts` (Updating Supabase actions to handle updating a password directly or using the `currentPassword` parameter for manual changes)
