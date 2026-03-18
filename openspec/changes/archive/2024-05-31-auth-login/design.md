## Context

The application currently manages Nutritionists and Clients without authentication, using local storage. To support the Multi-client V1 phase, we need a robust, secure authentication system that identifies users, protects their data, and routes them appropriately. A key requirement is minimizing maintenance overhead and having a clear upgrade path for SSO in the future, while starting with a simple email/password invite flow.

## Goals / Non-Goals

**Goals:**
- Implement a unified login screen for both profile types.
- Integrate a third-party Auth Provider with a generous free tier.
- Create an invite-only flow for Clients, initiated by Nutritionists.
- Secure private routes using Next.js Middleware.

**Non-Goals:**
- Self-service registration for clients (deferred to when the platform grows).
- Social SSO implementation (e.g., Google/Apple login) in this iteration, though the architecture must support adding it easily later.

## Decisions

1. **Authentication Provider: Supabase Auth**
   - *Rationale:* Provides a generous free tier (50,000 MAU), built-in email/password auth, secure token handling, and out-of-the-box support for sending invite emails. It integrates seamlessly with Next.js App Router and provides a clear upgrade path if we decide to use Supabase as our main database.
   - *Alternatives Considered:* Auth.js (requires bringing our own DB adapter for magic links/invites, which adds setup overhead), Firebase (higher risk of vendor lock-in).

2. **Unified Login with Role-Based Redirection**
   - *Rationale:* Simplifies the UI. The user's role (Nutritionist vs. Client) will be stored in their profile or metadata, allowing the system to redirect them to the appropriate route (`/(dashboard)` or `/(client-portal)`) after successful login.
   - *Alternatives Considered:* Separate login pages, which would increase maintenance and potentially confuse users.

3. **Client Invitation Workflow**
   - *Rationale:* Nutritionists must retain control over their client roster in V1. Using the Auth Provider's admin API allows sending a secure invitation link that prompts the client to set a password on their first visit.

## Risks / Trade-offs

- **Risk: Email Deliverability** → *Mitigation:* We will rely on Supabase's default email service initially, but we should be prepared to configure a custom SMTP (like Resend) if deliverability issues arise in production.
- **Risk: Next.js Middleware Complexity** → *Mitigation:* We will use the officially supported `@supabase/ssr` package to handle session checks in Middleware, keeping the logic minimal to avoid performance bottlenecks.
