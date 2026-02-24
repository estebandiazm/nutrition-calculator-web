## Why

The current web application uses a combination of dark grays and light blues which makes the interface feel slightly dated and lacking in contrast. A modern, blue-toned redesign will improve the application's visual hierarchy, making it appear more premium, sober, and easier to read for our users.

## What Changes

- Complete overhaul of the primary and secondary color palettes in `light-theme.ts` to utilize deep navy and cyan/sky tones.
- Adjustments to typography sizes and weights for improved readability and negative space.
- Subtle modern aesthetic touches: updated button shapes (border-radius), softer component shadows for depth, cohesive background contrasting.
- Integration of modern gradients and transparencies (glassmorphism touches) to elevate the overall design aesthetic.

## Capabilities

### New Capabilities
*(None for this strictly stylistic change)*

### Modified Capabilities
- `ui-theme`: Modernize the existing visual theme while keeping the current `ClientContext` data capabilities intact.

## Impact

- `src/themes/light-theme.ts`: Core theme adjustments (colors, typographies, component overrides).
- Potential layout background styling touches across `src/components/`.
