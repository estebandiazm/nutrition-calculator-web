## Why

The platform needs a dedicated client-facing dashboard to view and track nutritional plans. The new `client-dashboard` provides a clear, responsive, and visually appealing interface based on the new Premium Design (Stitch MCP). This allows nutritionists to convey the plans effectively, and clients to understand their dietary and hydration goals easily.

## What Changes

- Creation of a new Next.js route: `app/(client-portal)/dashboard/page.tsx`
- Removal of the legacy viewer route/page since it's being replaced.
- Update the login redirection so that users with the 'client' role are directed to the new `/dashboard`.
- Implementation of responsive shared UI components (GlassCard, NeonButton) based on the new UI design.
- Implementation of domain-specific components: StepsTracker, HydrationTracker, MacrosHUD, MealCards with search/filtering capabilities, and Snacks/Sups tracker.
- Integration of custom Tailwind colors and typography from the Stitch design into `tailwind.config.ts`.

## Capabilities

### New Capabilities
- `client-dashboard-ui`: A read-only dashboard for clients displaying their current plan's steps, hydration, macros, and detailed meals with search capability.

### Modified Capabilities


## Impact

- Adds new components to `src/components/ui/` and `src/components/dashboard/`.
- Modifies `tailwind.config.ts` and potentially global css.
- Creates a new route in the App Router under `(client-portal)`.
- Removes legacy viewer components and routes.
- Modifies auth callback/login logic to handle client role redirection.
