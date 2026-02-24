## Why

The current `nutrition-calculator-web` application logic and components are tightly coupled. To scale the project and eventually integrate AI models seamlessly as an advisor copilot, the codebase needs an architectural reorganization using the OpenSpec framework. This allows us to establish clear contracts (specs) for the deterministic calculation engine before introducing AI components, ensuring a robust and well-documented foundation.

## What Changes

- Reorganize the folder structure to separate UI, business logic (Diet Engine), and data adapters following a spec-driven architecture.
- Abstract the hardcoded food databases (`GetFood.ts`) into a clear data provider pattern or capability.
- Decouple the `CalculateFood.ts` logic into a pure domain service that strictly adheres to an Open Spec schema (`DietPlan`).
- Refactor the React components (`Creator.tsx` and `Viewer.tsx`) to produce and consume the standardized JSON schema.

## Capabilities

### New Capabilities
- `diet-plan-generator`: Core capability for deterministic calculation of food portions based on macronutrient targets and food preferences, outputting a standardized DietPlan schema.
- `food-database`: Management and retrieval of available foods, categorizations, and their nutritional values.

### Modified Capabilities

## Impact

- **UI Components:** `Creator.tsx` and `Viewer.tsx` will be refactored to handle the new data contracts.
- **Business Logic:** `CalculateFood.ts` and `GetFood.ts` will be moved and refactored into isolated domain modules.
- **Data Flow:** The global state (`ClientContext`) will be updated to store and distribute the `DietPlan` schema correctly.
