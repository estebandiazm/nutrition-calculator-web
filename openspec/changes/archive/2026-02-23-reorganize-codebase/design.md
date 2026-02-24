## Context

The `nutrition-calculator-web` currently lacks a clear separation between data (hardcoded arrays in `GetFood.ts`), business logic (`CalculateFood.ts`), and view components. As we prepare to integrate an AI-powered copilot for advisors, we need a robust, spec-driven architecture. This refactor implements a deterministic calculation engine wrapped in an OpenSpec JSON Schema (`DietPlan`) to ensure strict data contracts. 

## Goals / Non-Goals

**Goals:**
- Move deterministic calculation logic to a dedicated `DietEngine` domain service.
- Standardize data retrieval through a `FoodDatabase` interface.
- Establish the `DietPlan` JSON Schema as the universal data contract.
- Refactor React components (`Creator.tsx`, `Viewer.tsx`) to consume the standardized schema.

**Non-Goals:**
- Integrating the actual LLM / Vercel AI SDK. This design isolates the deterministic logic first. The LLM will be introduced in a subsequent change using these established interfaces.
- Changing the existing UI theme or broad user flows.

## Decisions

### 1. Data Contracts (JSON Schema)
We will introduce `src/model/DietPlan.ts` exporting Zod schemas and TypeScript types reflecting the `DietPlan` spec.
*Rationale*: Using Zod ensures runtime validation, which is critical when we later plug in AI Structured Outputs. This guarantees the UI never breaks due to malformed data.

### 2. Domain Separation
We will create a specific `domain/` or `services/` directory for the `DietEngine` and `FoodDatabase`.
*Rationale*: `src/adapters/` currently holds both data logic and business logic. Separating them clarifies dependencies. Components will call the `DietEngine`, which internally queries the `FoodDatabase`.

### 3. State Management
The `ClientContext` will be updated to hold the `DietPlan` structured object instead of loose arrays of foods.
*Rationale*: Simplifies data passing between the `Creator` and the `Viewer`.

## Risks / Trade-offs

- **[Risk] Broken component references during refactor** → Complete the refactor incrementally. First schemas, then domain services, then adapt the UI. Add basic unit tests for the deterministic engine to verify calculations remain identical.
