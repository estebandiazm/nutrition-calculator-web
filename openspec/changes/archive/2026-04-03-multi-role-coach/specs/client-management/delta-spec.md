# Delta Spec: Client Management

## Change: multi-role-coach

## Modified Requirements

### REQ-CLI-001: Nutritionist reference on Client model
**Before**: The `Client` Mongoose model included a `nutritionistId` field (required ObjectId, ref to `Nutritionist` collection).
**After**: The `Client` Mongoose model SHALL use a `coachId` field (required ObjectId, ref to `Coach` collection) in place of `nutritionistId`. Every client MUST still be associated with a coach.
**Reason**: Aggregate rename from Nutritionist to Coach.

### REQ-CLI-002: Filter clients by coach (replaces getClientsByNutritionist)
**Before**: `getClientsByNutritionist` Server Action retrieved all clients for a given nutritionist ID.
**After**: `getClientsByCoach` Server Action SHALL retrieve all clients associated with a specific `coachId`. The action signature changes from `getClientsByNutritionist(nutritionistId: string)` to `getClientsByCoach(coachId: string)`.
**Reason**: Aggregate rename.

### REQ-CLI-003: createClient accepts coachId
**Before**: `createClient` accepted `nutritionistId` as a required field.
**After**: `createClient` SHALL accept `coachId` as the required association field. Passing `nutritionistId` SHALL be a type error (TypeScript strict mode enforced).
**Reason**: Field rename follows aggregate rename.

## New Requirements

_(none for this capability)_

## Removed Requirements

### REQ (nutritionistId field on Client)
**Removed because**: Replaced by `coachId` in REQ-CLI-001. The `nutritionistId` field is renamed as part of the migration script (see `coach-management` delta spec REQ-CM-NEW-003).

## Scenarios (Gherkin)

Feature: Client management (coach reference)

  Scenario: Client created with coachId reference
    Given a valid coach document exists with a known ID
    When createClient is called with that coachId
    Then the system stores the client with the coachId reference
    And the client is retrievable by that coach

  Scenario: Client creation rejected without coachId
    Given client data with no coachId
    When createClient is called
    Then the system rejects the operation with a validation error

  Scenario: Clients filtered by coach
    Given multiple clients exist, some with coachId "coach-A" and some with coachId "coach-B"
    When getClientsByCoach is called with "coach-A"
    Then the system returns only clients whose coachId is "coach-A"
    And they are ordered by most recently updated

  Scenario: No clients for coach
    Given a coach exists but has no associated clients
    When getClientsByCoach is called with that coachId
    Then the system returns an empty array

  Scenario: nutritionistId is no longer a valid field
    Given TypeScript strict mode is enabled
    When a developer attempts to pass nutritionistId to createClient
    Then a TypeScript compilation error is raised
