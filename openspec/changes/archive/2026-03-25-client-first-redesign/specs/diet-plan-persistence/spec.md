## MODIFIED Requirements

### Requirement: DietPlan embedded data model
The system SHALL define the `DietPlan` Mongoose sub-schema with the following structure: `label` (optional string), `days` (optional string), `recommendations` (optional string), `meals` (array of `Meal` sub-documents), `snacks` (array of `SnackOption` sub-documents), and `createdAt` (auto-generated date). The `clientId` and `clientName` fields SHALL be removed since these are implicit from the parent `Client` document.

#### Scenario: DietPlan schema validates embedded structure
- **WHEN** a DietPlan is embedded in a Client document with meals, blocks, and food options
- **THEN** the system SHALL validate and persist the full nested hierarchy without `clientId` or `clientName` fields

#### Scenario: Food items stored as snapshots
- **WHEN** a diet plan is saved
- **THEN** food items within the plan SHALL be stored as static copies (snapshots), preserving the historical integrity of the plan regardless of future food dictionary changes

## REMOVED Requirements

### Requirement: DietPlan clientId and clientName fields
**Reason**: The `clientId` and `clientName` fields in the DietPlan schema are redundant because plans are embedded within Client documents. The parent Client already provides `_id` and `name`.
**Migration**: No data migration required. Existing documents with these fields will continue to function; fields are simply ignored. New documents will not include them. The Zod schema (`DietPlan.ts`) and Mongoose sub-schema (`Client.ts`) SHALL both remove these fields.
