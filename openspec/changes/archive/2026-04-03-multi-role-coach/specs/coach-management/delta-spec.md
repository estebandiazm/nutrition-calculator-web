# Delta Spec: Coach Management

## Change: multi-role-coach

## Modified Requirements

### REQ-CM-001: Coach data model (replaces Nutritionist data model)
**Before**: The system defined a `Nutritionist` Mongoose model in the `nutritionists` collection with fields `name` (required string) and `email` (required string, unique).
**After**: The system SHALL define a `Coach` Mongoose model in the `coaches` collection with fields `name` (required string), `email` (required string, unique), and `authId` (optional string, sparse unique index). Timestamps are unchanged.
**Reason**: Product rename from "Nutritionist" to "Coach". The `authId` field is required to enable profile lookup by Supabase auth identity (see `coach-profile-lookup` spec).

### REQ-CM-002: Create coach (replaces createNutritionist)
**Before**: `createNutritionist` Server Action accepted nutritionist data and persisted to the `Nutritionist` model.
**After**: `createCoach` Server Action SHALL accept coach data and persist a new `Coach` document to MongoDB. The action SHALL be exported from `src/app/actions/coachActions.ts`.
**Reason**: Aggregate rename.

### REQ-CM-003: Get coach by ID (replaces getNutritionistById)
**Before**: `getNutritionistById` returned a single nutritionist by document ID.
**After**: `getCoachById` SHALL return a single coach document by document ID, or `null` if not found.
**Reason**: Aggregate rename.

### REQ-CM-004: List all coaches (replaces getNutritionists)
**Before**: `getNutritionists` returned all nutritionist records ordered by name.
**After**: `getCoaches` SHALL return all coach records ordered by name.
**Reason**: Aggregate rename.

## New Requirements

### REQ-CM-NEW-001: Get coach by auth ID
The system SHALL provide a `getCoachByAuthId` Server Action. See `coach-profile-lookup` spec for full detail.

### REQ-CM-NEW-002: MongoDB collection name
The `Coach` Mongoose model SHALL explicitly declare `{ collection: 'coaches' }` in schema options so that the new model does not auto-pluralise to a different collection name.

### REQ-CM-NEW-003: One-time migration script
The system SHALL provide a migration script at `scripts/migrate-nutritionist-to-coach.ts` that:
- Copies all documents from the `nutritionists` collection to `coaches`
- Renames the `nutritionistId` field to `coachId` in all documents in the `clients` collection
- Is idempotent (safe to run multiple times without duplicating data)
- Preserves the original `nutritionists` collection (copy, not move)

## Removed Requirements

### REQ (Nutritionist data model)
**Removed because**: Replaced by REQ-CM-001 (Coach data model). The `Nutritionist` type and collection are obsolete after migration.

## Scenarios (Gherkin)

Feature: Coach management

  Scenario: Coach document created with required fields
    Given valid coach data with name and unique email
    When createCoach is called
    Then the system persists the document in the coaches collection with auto-generated _id and timestamps

  Scenario: Coach creation rejected without name
    Given coach data missing the name field
    When createCoach is called
    Then the system rejects the operation with a validation error

  Scenario: Coach creation rejected with duplicate email
    Given a coach already exists with email "coach@example.com"
    When createCoach is called with the same email
    Then the system rejects the operation with a duplicate key error

  Scenario: Coach found by ID
    Given a coach document exists with a known ID
    When getCoachById is called with that ID
    Then the system returns the full coach document

  Scenario: Coach not found by ID
    Given no coach exists with the provided ID
    When getCoachById is called
    Then the system returns null

  Scenario: All coaches listed
    Given multiple coach documents exist
    When getCoaches is called
    Then the system returns all coach documents ordered by name

  Scenario: Migration script copies nutritionists to coaches
    Given documents in the nutritionists collection
    When the migration script is executed
    Then all documents appear in the coaches collection
    And the nutritionists collection is still intact (copy, not move)

  Scenario: Migration script renames nutritionistId to coachId in clients
    Given client documents with a nutritionistId field
    When the migration script is executed
    Then all client documents have coachId instead of nutritionistId
    And no client document retains a nutritionistId field
