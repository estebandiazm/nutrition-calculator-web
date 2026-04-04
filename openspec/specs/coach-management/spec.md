## ADDED Requirements

### Requirement: Coach data model
The system SHALL define a `Coach` Mongoose model in the `coaches` collection with the following fields: `name` (required string), `email` (required string, unique), and `authId` (optional string, sparse unique index). Timestamps (`createdAt`, `updatedAt`) SHALL be managed automatically.

#### Scenario: Coach document created with required fields
- **WHEN** a new coach is created with valid `name` and `email`
- **THEN** the system SHALL persist the coach document in the `coaches` collection with auto-generated `_id` and timestamps

#### Scenario: Coach creation rejected without name
- **WHEN** a coach creation is attempted without providing a `name`
- **THEN** the system SHALL reject the operation with a validation error

#### Scenario: Coach creation rejected with duplicate email
- **WHEN** a coach creation is attempted with an `email` that already exists
- **THEN** the system SHALL reject the operation with a duplicate key error

### Requirement: Create coach
The system SHALL provide a `createCoach` Server Action that accepts coach data and persists a new `Coach` document to MongoDB.

#### Scenario: New coach created successfully
- **WHEN** the `createCoach` action is invoked with valid data (name and unique email)
- **THEN** the system SHALL save the coach to the database and return the created coach object with a serialised `id` field

### Requirement: Get coach by ID
The system SHALL provide a `getCoachById` Server Action that retrieves a single coach by their document ID.

#### Scenario: Coach found
- **WHEN** `getCoachById` is invoked with a valid existing coach ID
- **THEN** the system SHALL return the full coach document

#### Scenario: Coach not found
- **WHEN** `getCoachById` is invoked with an ID that does not exist
- **THEN** the system SHALL return `null`

### Requirement: List all coaches
The system SHALL provide a `getCoaches` Server Action that retrieves all coach records.

#### Scenario: Coaches retrieved successfully
- **WHEN** the `getCoaches` action is invoked
- **THEN** the system SHALL return an array of all coach documents ordered by name

### Requirement: Get coach by auth ID
The system SHALL provide a `getCoachByAuthId` Server Action that accepts a Supabase user ID string and returns the matching `Coach` document, or `null` if no coach with that `authId` exists. See `coach-profile-lookup` spec for full detail.

#### Scenario: Coach found by auth ID
- **WHEN** `getCoachByAuthId` is invoked with a valid existing coach authId
- **THEN** the system SHALL return the full coach document

#### Scenario: Coach not found by auth ID
- **WHEN** `getCoachByAuthId` is invoked with an authId that does not exist
- **THEN** the system SHALL return `null`

### Requirement: MongoDB collection name
The `Coach` Mongoose model SHALL explicitly declare `{ collection: 'coaches' }` in schema options so that the new model does not auto-pluralise to a different collection name.

### Requirement: One-time migration script
The system SHALL provide a migration script at `scripts/migrate-nutritionist-to-coach.ts` that:
- Copies all documents from the `nutritionists` collection to `coaches`
- Renames the `nutritionistId` field to `coachId` in all documents in the `clients` collection
- Is idempotent (safe to run multiple times without duplicating data)
- Preserves the original `nutritionists` collection (copy, not move)

#### Scenario: Migration script copies nutritionists to coaches
- **WHEN** the migration script is executed
- **THEN** all documents appear in the `coaches` collection and the `nutritionists` collection is still intact (copy, not move)

#### Scenario: Migration script renames nutritionistId to coachId in clients
- **WHEN** the migration script is executed
- **THEN** all client documents have `coachId` instead of `nutritionistId` and no client document retains a `nutritionistId` field
