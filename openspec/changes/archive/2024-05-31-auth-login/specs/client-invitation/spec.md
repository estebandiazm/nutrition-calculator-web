## ADDED Requirements

### Requirement: Client Profile Creation by Nutritionist
The system SHALL allow a Nutritionist to create a Client profile from their dashboard.

#### Scenario: Successful profile creation
- **WHEN** Nutritionist submits the required client details
- **THEN** system creates the client record associated with the Nutritionist

### Requirement: Client Invitation
The system SHALL support sending an initial access invitation (which may include a temporary password or magic link) to the newly created Client.

#### Scenario: Invitation sent
- **WHEN** Nutritionist triggers the invitation for a client
- **THEN** system sends the access credentials/link to the client's email address

### Diagram: Invitation Flow

```mermaid
sequenceDiagram
    participant N as Nutritionist
    participant S as System (Next.js)
    participant A as Auth Provider (Supabase)
    participant C as Client

    N->>S: 1. Fills client details & clicks "Invite"
    S->>A: 2. Call admin.inviteUserByEmail()
    A-->>C: 3. Delivers email with Magic Link
    C->>S: 4. Clicks link & verifies session
    S->>S: 5. Prompts to set password (if applicable)
    C->>S: 6. Saves password
    S-->>C: 7. Grants access to (client-portal)
```
