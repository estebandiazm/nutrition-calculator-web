## MODIFIED Requirements

### Requirement: Clients list page
The system SHALL provide the clients list at the root route (`/`) instead of `/clients`. The page SHALL display all registered clients in a list layout.

#### Scenario: Page renders with existing clients
- **WHEN** a nutritionist navigates to `/` and clients exist in the database
- **THEN** the page SHALL display each client's name and basic information, fetched via the `getClients` Server Action

#### Scenario: Page renders with no clients
- **WHEN** a nutritionist navigates to `/` and no clients exist
- **THEN** the page SHALL display an empty state message encouraging the user to create their first client

### Requirement: Client detail page
The system SHALL provide a dynamic page at `/clients/[id]` that displays a specific client's full profile, their historical diet plans, and a navigation action to view each plan.

#### Scenario: Client detail loaded successfully
- **WHEN** a nutritionist navigates to `/clients/[id]` with a valid client ID
- **THEN** the page SHALL display the client's name, target weight, and a chronological list of all their saved diet plans

#### Scenario: Non-existent client ID
- **WHEN** a nutritionist navigates to `/clients/[id]` with an ID that does not exist
- **THEN** the page SHALL display a not-found message or redirect to the clients list

#### Scenario: View plan from client detail
- **WHEN** a nutritionist clicks the "Ver Plan" action on a plan card in the client detail page
- **THEN** the system SHALL navigate to `/viewer?clientId=<id>&planIndex=<index>` displaying the full plan

## ADDED Requirements

### Requirement: Creator route
The system SHALL provide the diet plan creator at the `/creator` route instead of the root route (`/`).

#### Scenario: Creator accessible at new route
- **WHEN** a nutritionist navigates to `/creator`
- **THEN** the system SHALL render the diet plan Creator component

### Requirement: Navigation menu updates
The system SHALL update the navigation menu to reflect the new route structure: the logo link SHALL navigate to `/` (clients list), and a "Crear Plan" link SHALL navigate to `/creator`.

#### Scenario: Logo navigates to clients list
- **WHEN** a nutritionist clicks the app logo in the navigation bar
- **THEN** the system SHALL navigate to `/` which displays the clients list

#### Scenario: Creator link in menu
- **WHEN** a nutritionist clicks the "Crear Plan" link in the navigation bar
- **THEN** the system SHALL navigate to `/creator`
