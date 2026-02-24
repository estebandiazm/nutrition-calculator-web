## 1. Domain Types and Contracts

- [x] 1.1 Migrate models from `src/model/` to `src/domain/types/`. Create `Food.ts`.
- [x] 1.2 Define the strictly typed `DietPlan` schema in `src/domain/types/DietPlan.ts`.

## 2. Capability: Food Database

- [x] 2.1 Extract hardcoded data from `src/adapters/GetFood.ts` into a dedicated constant file (or mock DB) in `src/domain/data/foods.ts`.
- [x] 2.2 Create the `FoodDatabase` service (`src/domain/services/FoodDatabase.ts`) with methods like `getFoodsByCategory()`.
- [x] 2.3 Refactor React components to import and use the `FoodDatabase` service instead of raw data arrays.

## 3. Capability: Diet Plan Generator (DietEngine)

- [x] 3.1 Migrate `CalculateFood.ts` logic to `src/domain/services/DietEngine.ts`.
- [x] 3.2 Refactor the calculation algorithm in `DietEngine.ts` to output data conforming geometrically to the `DietPlan` schema instead of returning loose arrays.
- [x] 3.3 Ensure the deterministic calculation logic (proportions relative to the pivot/base fruit/protein) remains mathematically intact.

## 4. UI Refactor

- [x] 4.1 Update the global state (`src/context/ClientContext.tsx` and `ClientContextType.ts`) to store a `DietPlan` object.
- [x] 4.2 Update `src/components/creator/Creator.tsx` to collect inputs, call `DietEngine.generatePlan()`, and save the structured `DietPlan` to context.
- [x] 4.3 Update `src/components/viewer/Viewer.tsx` to read the unified `DietPlan` object structure and iterate dynamically over `blocks` and `options` instead of relying on statically named layout blocks.
- [x] 4.4 Remove `src/adapters/` completely as logic is now owned by `src/domain/services/`.
