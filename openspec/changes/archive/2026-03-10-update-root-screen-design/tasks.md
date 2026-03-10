## 1. Domain Model Updates

- [x] 1.1 Update `DietPlan.ts`: add optional `label: string` and `days: string` fields to `DietPlanSchema` (Zod) and `DietPlan` type
- [x] 1.2 Update `Client.ts`: change `plan?: DietPlan` to `plans: DietPlan[]`

## 2. Context Updates

- [x] 2.1 Update `ClientContextType`: change `saveClient` signature to accept `plans: DietPlan[]` instead of a single `plan`
- [x] 2.2 Update `ClientContext.tsx`: update `saveClient` implementation to store `plans` array on the client object

## 3. PlanCard Component

- [x] 3.1 Create `src/components/creator/PlanCard.tsx` with glassmorphic card style (semi-transparent dark navy background, backdrop blur, rounded corners)
- [x] 3.2 Add `label` display (e.g., "Plan 1") as the card title
- [x] 3.3 Add `Days` text input field (free-form) to `PlanCard`
- [x] 3.4 Add `Proteins (g)` and `Carbs (g)` numeric inputs side-by-side in `PlanCard`
- [x] 3.5 Add `Fruits (g)` and `Fats (g)` numeric inputs side-by-side in `PlanCard`
- [x] 3.6 Add food list display within `PlanCard`: each food shown with category emoji, name, and gram amount
- [x] 3.7 Add pill-shaped "Add Another Meal" button with magenta-to-purple gradient (`#E91E8C → #9C27B0`) in `PlanCard`
- [x] 3.8 Add pill-shaped "Save Plan" button with magenta-to-purple gradient in `PlanCard`
- [x] 3.9 Wire `PlanCard` props: `plan: PlanDraft`, `index: number`, `onUpdate: (index, updatedPlan) => void`

## 4. Creator Component Refactor

- [x] 4.1 Define `PlanDraft` type in `Creator.tsx` (or shared types file): `{ id, label, days, proteins, carbs, fruits, fats, foods }`
- [x] 4.2 Replace flat `data` state with `plans: PlanDraft[]` initialized with one default plan draft
- [x] 4.3 Render `Client` name input field (pill-shaped, rounded) in Creator header
- [x] 4.4 Render `Target Weight (kg)` input field (pill-shaped, rounded) in Creator header
- [x] 4.5 Render one `PlanCard` per entry in `plans` array
- [x] 4.6 Implement `Add Another Plan` button that appends a new default `PlanDraft` to the `plans` array
- [x] 4.7 Implement `handlePlanUpdate(index, updatedPlan)` callback to update a specific plan in the `plans` array
- [x] 4.8 Implement `handleSavePlan(index)`: calls `DietEngine.generatePlan` with the plan's macros and foods, adds the result to the client's `plans[]`, then navigates to viewer
- [x] 4.9 Apply dark navy / glassmorphic background to the root screen layout consistent with `ui-theme` spec

## 5. Viewer Update

- [x] 5.1 Update `src/app/viewer/` page/component to read `client.plans` (array) instead of `client.plan` (singular)
- [x] 5.2 Render each `DietPlan` in `client.plans` with its `label` and `days` as a section header in the viewer

## 6. Verification

- [x] 6.1 Verify root screen renders "Plan 1" card by default with all macro fields and Days input
- [x] 6.2 Verify clicking "Add Another Plan" appends "Plan 2" card with empty/default values
- [x] 6.3 Verify macro values entered in Plan 1 do not affect Plan 2 fields
- [x] 6.4 Verify "Save Plan" triggers navigation to viewer and viewer displays all plans
- [x] 6.5 Verify glassmorphic card style and gradient buttons match design prototype visually
- [x] 6.6 Verify food list within a plan card displays emoji + name + grams correctly
