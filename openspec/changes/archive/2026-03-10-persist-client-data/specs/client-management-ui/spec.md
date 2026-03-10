## ADDED Requirements

### Requirement: Clients list page
The system SHALL provide a page at the `/clients` route that displays all registered clients in a list or grid layout.

#### Scenario: Page renders with existing clients
- **WHEN** a nutritionist navigates to `/clients` and clients exist in the database
- **THEN** the page SHALL display each client's name and basic information, fetched via the `getClients` Server Action

#### Scenario: Page renders with no clients
- **WHEN** a nutritionist navigates to `/clients` and no clients exist
- **THEN** the page SHALL display an empty state message encouraging the user to create their first client

### Requirement: Client detail page
The system SHALL provide a dynamic page at `/clients/[id]` that displays a specific client's full profile and their historical diet plans.

#### Scenario: Client detail loaded successfully
- **WHEN** a nutritionist navigates to `/clients/[id]` with a valid client ID
- **THEN** the page SHALL display the client's name, target weight, and a chronological list of all their saved diet plans

#### Scenario: Non-existent client ID
- **WHEN** a nutritionist navigates to `/clients/[id]` with an ID that does not exist
- **THEN** the page SHALL display a not-found message or redirect to the clients list

### Requirement: Save Plan modal in Diet Creator
The system SHALL provide a modal dialog in the Diet Creator view that allows the nutritionist to save a generated diet plan to a client profile.

#### Scenario: Modal opened from Creator
- **WHEN** the nutritionist clicks the "Save Plan" button in the Diet Creator view
- **THEN** a modal SHALL appear allowing the user to either select an existing client from a dropdown or enter a new client name

#### Scenario: Save plan to existing client
- **WHEN** the nutritionist selects an existing client and confirms
- **THEN** the system SHALL invoke `addDietPlanToClient` with the selected client ID and the generated DietPlan JSON, and display a success confirmation

#### Scenario: Save plan to new client
- **WHEN** the nutritionist enters a new client name and confirms
- **THEN** the system SHALL invoke `createClient` with the new name, then invoke `addDietPlanToClient` with the created client's ID and the generated DietPlan JSON, and display a success confirmation

### Requirement: Loading and error states
The system SHALL provide visual feedback during database operations and handle errors gracefully across all client management views.

#### Scenario: Loading state during save
- **WHEN** the system is persisting data to the database
- **THEN** the UI SHALL display a loading indicator (spinner or similar) and disable interactive controls to prevent duplicate submissions

#### Scenario: Database error displayed
- **WHEN** a database operation fails (connection error, validation error, etc.)
- **THEN** the UI SHALL display a user-friendly error message without exposing internal details
