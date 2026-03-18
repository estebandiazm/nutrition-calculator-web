## ADDED Requirements

### Requirement: Unified Login
The system SHALL provide a unified login interface for all users (Nutritionists and Clients) using the chosen authentication provider.

#### Scenario: Successful login
- **WHEN** user enters valid credentials and submits
- **THEN** system authenticates the user and redirects them based on their role

#### Scenario: Invalid login
- **WHEN** user enters invalid credentials and submits
- **THEN** system displays an appropriate error message and prevents access

### Requirement: Role-Based Access Control and Routing
The system SHALL secure private routes and route users according to their profile type.

#### Scenario: Nutritionist access
- **WHEN** an authenticated Nutritionist accesses the system
- **THEN** system routes them to the `(dashboard)` area

#### Scenario: Client access
- **WHEN** an authenticated Client accesses the system
- **THEN** system routes them to the `(client-portal)` area

#### Scenario: Unauthorized access attempt
- **WHEN** an unauthenticated user attempts to access a protected route
- **THEN** system redirects them to the login screen
