# Spec: Unified Login Flow

## Overview
A single `/login` form handles authentication for all roles. After Supabase validates credentials, the system reads `user_metadata.role` from the session and redirects the user to the view appropriate for their role. No separate login URLs per role.

## Requirements

### REQ-001: Single login entry point
The system SHALL expose a single `/login` route that accepts credentials for users of any role (`coach`, `client`). There SHALL be no role-specific login pages.

### REQ-002: Role-based redirect after login
After successful authentication, the login Server Action SHALL read `user_metadata.role` from the Supabase session and redirect as follows:

| Role value | Redirect target |
|------------|----------------|
| `coach`    | `/clients`      |
| `client`   | `/dashboard`    |
| unknown / missing | `/login` (re-prompt with error) |

### REQ-003: Unknown role handling
If the authenticated user's `user_metadata.role` is absent or does not match a known value, the system SHALL NOT redirect to a protected route. It SHALL display an error message and keep the user on the login page.

### REQ-004: No backward compatibility with 'nutritionist' role
The login flow SHALL NOT recognise `'nutritionist'` as a valid role value. Users with the old role in Supabase metadata must be migrated before deployment. This is an explicit out-of-scope backward-compat decision (see proposal).

## Scenarios (Gherkin)

Feature: Unified login flow

  Scenario: Coach logs in and is redirected to clients list
    Given a Supabase user exists with user_metadata.role = "coach"
    When that user submits valid credentials on /login
    Then the system redirects them to /clients

  Scenario: Client logs in and is redirected to dashboard
    Given a Supabase user exists with user_metadata.role = "client"
    When that user submits valid credentials on /login
    Then the system redirects them to /dashboard

  Scenario: User with unknown role is denied redirect
    Given a Supabase user exists with user_metadata.role = "nutritionist"
    When that user submits valid credentials on /login
    Then the system does NOT redirect to a protected route
    And an error message is displayed on the login page

  Scenario: User with no role metadata is denied redirect
    Given a Supabase user exists with no user_metadata.role set
    When that user submits valid credentials on /login
    Then the system does NOT redirect to a protected route
    And an error message is displayed on the login page

  Scenario: Invalid credentials rejected
    Given any user
    When that user submits an incorrect password on /login
    Then the system displays a Supabase authentication error message
    And does not redirect

  Scenario: Unauthenticated user cannot access protected routes
    Given a user is not logged in
    When they navigate directly to /clients or /dashboard
    Then the middleware redirects them to /login
