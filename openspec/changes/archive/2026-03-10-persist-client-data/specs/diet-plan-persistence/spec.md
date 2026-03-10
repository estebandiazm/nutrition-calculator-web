## ADDED Requirements

### Requirement: DietPlan embedded data model
The system SHALL define the `DietPlan` Mongoose sub-schema with the following structure: `label` (optional string), `days` (optional string), `recommendations` (optional string), `meals` (array of `Meal` sub-documents), `snacks` (array of `SnackOption` sub-documents), and `createdAt` (auto-generated date). Each `Meal` SHALL contain `mealName` and an array of `MealBlock` sub-documents. Each `MealBlock` SHALL contain `blockType` and an array of `FoodOption` sub-documents. Each `FoodOption` SHALL contain `foodName`, `grams`, optional `measureUnit`, and optional `notes`.

#### Scenario: DietPlan schema validates embedded structure
- **WHEN** a DietPlan is embedded in a Client document with meals, blocks, and food options
- **THEN** the system SHALL validate and persist the full nested hierarchy

#### Scenario: Food items stored as snapshots
- **WHEN** a diet plan is saved
- **THEN** food items within the plan SHALL be stored as static copies (snapshots), preserving the historical integrity of the plan regardless of future food dictionary changes

### Requirement: Save diet plan to client
The system SHALL provide an `addDietPlanToClient` Server Action that appends a generated diet plan to an existing client's `plans` array.

#### Scenario: Diet plan appended successfully
- **WHEN** `addDietPlanToClient` is invoked with a valid client ID and a complete DietPlan object
- **THEN** the system SHALL push the plan into the client's `plans` array and return the updated client document

#### Scenario: Client not found when saving plan
- **WHEN** `addDietPlanToClient` is invoked with a client ID that does not exist
- **THEN** the system SHALL return an error indicating the client was not found

#### Scenario: Multiple plans per client
- **WHEN** a client already has one or more diet plans and a new plan is saved
- **THEN** the system SHALL append the new plan without modifying or removing existing plans
