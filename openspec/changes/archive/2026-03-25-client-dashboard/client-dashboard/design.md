## Context
The platform currently focuses on the nutritionist's workflow. The new `client-dashboard-ui` introduces a client-facing read-only view that leverages a premium design provided via Stitch MCP. The UI needs to be fully responsive, covering both mobile and desktop views, with custom glassmorphism effects and neon styling.

## Goals / Non-Goals
**Goals:**
- Implement a pixel-perfect responsive dashboard using the provided HTML/CSS references.
- Build reusable UI components (GlassCard, NeonButton) and domain components (MealCard, MacrosHUD).
- Update `tailwind.config.ts` with custom colors and fonts to support the new styling.
- Ensure clients log in and are correctly routed to the new dashboard.
- Clean up legacy viewer codebase to avoid tech debt.

**Non-Goals:**
- Implementing the real backend data connection in this phase (the UI will use static/stubbed data initially to verify the layout).
- Interactive manipulation of meal plans by the client (the dashboard is read-only).

## Decisions
- **Tailwind configuration**: Extend `tailwind.config.ts` with new color primitives (e.g., `surface-dim`, `accent-pink`, etc.) as defined in the target HTML to seamlessly support the Stitch design alongside existing styling.
- **Component styling**: Prefer raw Tailwind CSS as provided in the Stitch design over Material-UI for these specific components to ensure exact replica of the requested premium look.
- **Routing**: Map to `app/(client-portal)/dashboard/page.tsx` adhering to the `(client-portal)` route group pattern defined in `AGENTS.md`. Remove the old viewer route.
- **Authentication**: Update the Supabase auth callback (or login form routing) to redirect non-nutritionist users (clients) straight to the new dashboard.

## Risks / Trade-offs
- **Risk**: Potential clash between new Tailwind classes and existing MUI styles.
- **Mitigation**: Use specific class names and avoid generic resets. The GlassCard component will encapsulate the blur/translucency effects safely.
