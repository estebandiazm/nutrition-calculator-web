## Why

The application currently has two user profiles (Nutritionist, Client) but lacks a secure and structured way to identify them, protect their data, and route them to their respective domains. As the V1 phase approach (Multi-client), a robust authentication system is necessary to ensure privacy, enable nutritionist-client associations, and provide the foundation for future scalable features. 

## What Changes

- Introduce a unified Login screen that will authenticate both Nutritionists and Clients.
- Implement an authentication provider with a generous free tier (e.g., Supabase Auth or Auth.js) to handle email/password securely while minimizing maintenance and avoiding vendor lock-in issues at scale.
- Create an invitation-based registration flow for clients, allowing Nutritionists to generate client profiles and send them an initial access link/temporary password.
- Implement role-based routing upon successful login, directing Nutritionists to the `(dashboard)` and Clients to the `(client-portal)`.

## Capabilities

### New Capabilities
- `user-auth`: Defines the authentication strategy, unified login flow, session management, and role-based access control (RBAC) to differentiate between Nutritionists and Clients.
- `client-invitation`: Defines the workflow for Nutritionists to create client profiles and invite them to access the platform securely.

### Modified Capabilities

## Impact

- **Security & Data Privacy**: Secures plan and progress data, ensuring it is only accessible to authorized users.
- **Routing**: Next.js App Router middleware will be introduced to protect private routes and handle role-based redirection.
- **Infrastructure**: `AuthProvider` port will be implemented with a concrete adapter (e.g., Supabase Auth or Auth.js).
- **Domain Entities**: `Client` and `Nutritionist` types will need an association with an Auth ID.
