## ADDED Requirements

### Requirement: Stitch UI Login Screen
The system SHALL present the login screen matching the Stitch "Web Login Screen" design metrics and color palette.

#### Scenario: User visits login
- **WHEN** user navigates to `/login`
- **THEN** they see the branded dark mode login with email input and magic link trigger matching the Stitch project

#### Scenario: Invalid login attempt
- **WHEN** user submits an invalid email or Supabase rejects the magic link creation
- **THEN** system displays a styled error message matching the design system instead of unstyled text

### Requirement: Stitch UI Update Password Screen
The system SHALL present an update password screen matching the Stitch "Web Change Password" design.

#### Scenario: User arrives from invite link
- **WHEN** user clicks the Supabase invite link and arrives at `/update-password`
- **THEN** they are prompted to enter a new password with the new UI

### Requirement: Seamless Logout
The system SHALL provide a clear and styled logout experience.

#### Scenario: User clicks logout
- **WHEN** user clicks logout from the dashboard or portal
- **THEN** system clears the Supabase session, shows a visually cohesive loading indicator or toast, and redirects cleanly to `/login`

### Requirement: Root Redirect for Unauthenticated Users
The system SHALL redirect unauthenticated users attempting to access the root URL (`/`) to the login page.

#### Scenario: Unauthenticated user visits root
- **WHEN** an unauthenticated user navigates to `/`
- **THEN** the system redirects them to `/login`
