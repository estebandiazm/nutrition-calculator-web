## MODIFIED Requirements

### Requirement: Stitch UI Update Password Screen
The system SHALL present an update password screen matching the Stitch "Web Change Password" design and intelligently handle multiple authentication contexts.

#### Scenario: User arrives from invite or recovery link (Recovery Mode)
- **WHEN** user clicks the Supabase invite or recovery link and arrives at `/update-password?type=recovery`
- **THEN** they are prompted to enter only a "New Password" and "Confirm New Password" using the new UI

#### Scenario: Active user requests password change (Manual Update)
- **WHEN** an authenticated user manually navigates to `/update-password`
- **THEN** they are prompted to enter their "Current Password", "New Password", and "Confirm New Password" to authorize the change
