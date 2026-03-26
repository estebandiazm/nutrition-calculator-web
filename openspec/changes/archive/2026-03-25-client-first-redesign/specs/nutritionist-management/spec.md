## ADDED Requirements

### Requirement: Nutritionist data model
The system SHALL define a `Nutritionist` Mongoose model in its own collection (`nutritionists`) with the following fields: `name` (required string) and `email` (required string, unique). Timestamps (`createdAt`, `updatedAt`) SHALL be managed automatically.

#### Scenario: Nutritionist document created with required fields
- **WHEN** a new nutritionist is created with valid `name` and `email`
- **THEN** the system SHALL persist the nutritionist document in the `nutritionists` collection with auto-generated `_id` and timestamps

#### Scenario: Nutritionist creation rejected without name
- **WHEN** a nutritionist creation is attempted without providing a `name`
- **THEN** the system SHALL reject the operation with a validation error

#### Scenario: Nutritionist creation rejected with duplicate email
- **WHEN** a nutritionist creation is attempted with an `email` that already exists
- **THEN** the system SHALL reject the operation with a duplicate key error

### Requirement: Create nutritionist
The system SHALL provide a `createNutritionist` Server Action that accepts nutritionist data and persists a new `Nutritionist` document to MongoDB.

#### Scenario: New nutritionist created successfully
- **WHEN** the `createNutritionist` action is invoked with valid data (name and unique email)
- **THEN** the system SHALL save the nutritionist to the database and return the created nutritionist object with a serialised `id` field

### Requirement: Get nutritionist by ID
The system SHALL provide a `getNutritionistById` Server Action that retrieves a single nutritionist by their document ID.

#### Scenario: Nutritionist found
- **WHEN** `getNutritionistById` is invoked with a valid existing nutritionist ID
- **THEN** the system SHALL return the full nutritionist document

#### Scenario: Nutritionist not found
- **WHEN** `getNutritionistById` is invoked with an ID that does not exist
- **THEN** the system SHALL return `null`

### Requirement: List all nutritionists
The system SHALL provide a `getNutritionists` Server Action that retrieves all nutritionist records.

#### Scenario: Nutritionists retrieved successfully
- **WHEN** the `getNutritionists` action is invoked
- **THEN** the system SHALL return an array of all nutritionist documents ordered by name
