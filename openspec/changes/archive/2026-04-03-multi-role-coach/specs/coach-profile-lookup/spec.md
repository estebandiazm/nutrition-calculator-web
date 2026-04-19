# Spec: Coach Profile Lookup

## Overview
Provides the ability to look up a coach's profile document from a Supabase auth user ID. This mirrors the existing client-side `authId` pattern and closes the gap where the system could not resolve which coach is currently logged in.

## Requirements

### REQ-001: authId field on Coach model
The system SHALL add an `authId` field to the `Coach` Mongoose model. The field SHALL be a string, sparse (allows multiple `null` values), and uniquely indexed so that no two coaches share the same auth identity.

### REQ-002: getCoachByAuthId server action
The system SHALL provide a `getCoachByAuthId` Server Action that accepts a Supabase user ID string and returns the matching `Coach` document, or `null` if no coach with that `authId` exists.

### REQ-003: Return shape
The returned coach document SHALL include all persisted fields (`_id` serialised as `id`, `name`, `email`, `authId`, `createdAt`, `updatedAt`).

## Scenarios (Gherkin)

Feature: Coach profile lookup

  Scenario: Coach found by auth ID
    Given a coach document exists in the database with authId "user-uuid-abc"
    When getCoachByAuthId is called with "user-uuid-abc"
    Then the system returns the matching coach document with all fields

  Scenario: No coach found for auth ID
    Given no coach document exists with authId "user-uuid-xyz"
    When getCoachByAuthId is called with "user-uuid-xyz"
    Then the system returns null

  Scenario: authId is not duplicated
    Given a coach already exists with authId "user-uuid-abc"
    When a second coach creation is attempted with the same authId "user-uuid-abc"
    Then the system rejects the operation with a duplicate key error

  Scenario: Coach without authId does not appear in lookup
    Given a coach document exists with authId null
    When getCoachByAuthId is called with any string
    Then that coach is NOT returned (sparse index allows multiple nulls without collision)
