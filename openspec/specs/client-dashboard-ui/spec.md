## ADDED Requirements

### Requirement: Client Dashboard UI
The system SHALL provide a responsive, read-only dashboard for clients to view their active nutrition plans, track hydration, macros, and daily steps.

### Requirement: Client Login Redirection
The system SHALL redirect users with the client role directly to the dashboard upon successful authentication.

## REMOVED Requirements

### Requirement: Legacy Viewer
**Reason**: Replaced by the new Client Dashboard
**Migration**: Delete the old viewer route and components.
The system SHALL provide a responsive, read-only dashboard for clients to view their active nutrition plans, track hydration, macros, and daily steps.

#### Scenario: Client accesses their dashboard
- **WHEN** the client navigates to `/dashboard`
- **THEN** they see the premium UI including StepsTracker, HydrationTracker, MacrosHUD, and MealCards.

#### Scenario: Responsive layout adjustment
- **WHEN** viewed on a mobile device
- **THEN** the layout stacks appropriately and displays the bottom navigation bar.
- **WHEN** viewed on a desktop
- **THEN** the layout utilizes a grid and displays the top app bar navigation.

#### Scenario: Meal card interaction
- **WHEN** a client views a meal card
- **THEN** they can expand/collapse the details and use the search input to filter ingredients.

#### Scenario: Client logs into the platform
- **WHEN** a client successfully authenticates
- **THEN** the system redirects them to `/dashboard` instead of the nutritionist default view.


<----------------------------------------------------------------------------------------------------------------------- SYNCED FROM client-dashboard -->


## ADDED Requirements

### Requirement: Client Dashboard UI
The system SHALL provide a responsive, read-only dashboard for clients to view their active nutrition plans, track hydration, macros, and daily steps.

### Requirement: Client Login Redirection
The system SHALL redirect users with the client role directly to the dashboard upon successful authentication.

## REMOVED Requirements

### Requirement: Legacy Viewer
**Reason**: Replaced by the new Client Dashboard
**Migration**: Delete the old viewer route and components.
The system SHALL provide a responsive, read-only dashboard for clients to view their active nutrition plans, track hydration, macros, and daily steps.

#### Scenario: Client accesses their dashboard
- **WHEN** the client navigates to `/dashboard`
- **THEN** they see the premium UI including StepsTracker, HydrationTracker, MacrosHUD, and MealCards.

#### Scenario: Responsive layout adjustment
- **WHEN** viewed on a mobile device
- **THEN** the layout stacks appropriately and displays the bottom navigation bar.
- **WHEN** viewed on a desktop
- **THEN** the layout utilizes a grid and displays the top app bar navigation.

#### Scenario: Meal card interaction
- **WHEN** a client views a meal card
- **THEN** they can expand/collapse the details and use the search input to filter ingredients.

#### Scenario: Client logs into the platform
- **WHEN** a client successfully authenticates
- **THEN** the system redirects them to `/dashboard` instead of the nutritionist default view.
