## ADDED Requirements

### Requirement: Nutritionist reference on Client
The system SHALL add a `nutritionistId` field to the `Client` Mongoose model as a required `ObjectId` reference to the `Nutritionist` collection. Every client MUST be associated with a nutritionist.

#### Scenario: Client created with nutritionist reference
- **WHEN** a new client is created with a valid `nutritionistId`
- **THEN** the system SHALL store the reference and the client SHALL be retrievable by that nutritionist

#### Scenario: Client creation rejected without nutritionist reference
- **WHEN** a new client is created without a `nutritionistId`
- **THEN** the system SHALL reject the operation with a validation error

### Requirement: Filter clients by nutritionist
The system SHALL provide a `getClientsByNutritionist` Server Action that retrieves all clients associated with a specific nutritionist ID.

#### Scenario: Clients found for nutritionist
- **WHEN** `getClientsByNutritionist` is invoked with a nutritionist ID that has associated clients
- **THEN** the system SHALL return an array of matching client documents ordered by most recently updated

#### Scenario: No clients for nutritionist
- **WHEN** `getClientsByNutritionist` is invoked with a nutritionist ID that has no associated clients
- **THEN** the system SHALL return an empty array

## MODIFIED Requirements

### Requirement: Client data model
The system SHALL define a `Client` Mongoose model with the following fields: `name` (required string), `targetWeight` (optional number), `nutritionistId` (required ObjectId ref to Nutritionist), and `plans` (array of embedded `DietPlan` documents). Timestamps (`createdAt`, `updatedAt`) SHALL be managed automatically.

#### Scenario: Client document created with required fields
- **WHEN** a new client is created with a `name` value
- **THEN** the system SHALL persist the client document in the `clients` collection with auto-generated `_id` and timestamps

#### Scenario: Client creation rejected without name
- **WHEN** a client creation is attempted without providing a `name`
- **THEN** the system SHALL reject the operation with a validation error

### Requirement: Create client
The system SHALL provide a `createClient` Server Action that accepts client data (including required `nutritionistId`) and persists a new `Client` document to MongoDB.

#### Scenario: New client created successfully
- **WHEN** the `createClient` action is invoked with valid client data (at minimum a `name`)
- **THEN** the system SHALL save the client to the database and return the created client object
