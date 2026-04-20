# Spec: daily-weight-tracking

**Type**: NEW capability (full spec)
**Change**: daily-weight-tracking
**Date**: 2026-04-19

---

## Overview

Clients can log their daily body weight, view historical entries, and see computed trends. Coaches can view the same data for their clients. The system computes a 7-day rolling average using forward-fill from the nearest previous entry.

---

## Requirements

### REQ-DWT-01: Weight Entry Creation

The system SHALL allow a client to log a body weight measurement for a given date via a modal dialog on the dashboard.

| Attribute | Rule |
|-----------|------|
| Date | Past dates only — today or earlier. Future dates MUST be rejected. |
| Weight | Numeric, 0.1–500 kg inclusive. Values outside range MUST be rejected. |
| Notes | Optional free text, max 500 characters. |
| Duplicate date | If an entry already exists for the chosen date, the new value replaces it (upsert). |

#### Scenario: Client opens the log weight modal
- **GIVEN** the client is on the dashboard
- **WHEN** the client taps/clicks "Log Weight"
- **THEN** a modal opens with a date picker (defaulting to today), a weight input, and an optional notes field

#### Scenario: Client saves a valid weight entry
- **GIVEN** the modal is open with date = today, weight = 80, notes = "after breakfast"
- **WHEN** the client clicks Save
- **THEN** the entry is persisted and the modal closes without error

#### Scenario: Client submits a future date
- **GIVEN** the modal is open
- **WHEN** the client selects tomorrow's date and clicks Save
- **THEN** the system shows an inline validation error "Date cannot be in the future" and does NOT persist the entry

#### Scenario: Client submits an out-of-range weight
- **GIVEN** the modal is open
- **WHEN** the client enters 600 kg and clicks Save
- **THEN** the system shows an inline validation error "Weight must be between 0.1 and 500 kg" and does NOT persist the entry

#### Scenario: Client logs weight for a date that already has an entry
- **GIVEN** an entry exists for 2026-04-18 with weight = 79 kg
- **WHEN** the client logs weight 80 kg for 2026-04-18
- **THEN** the existing entry is updated to 80 kg (upsert — no duplicate created)

#### Scenario: First weight entry ever (no previous data)
- **GIVEN** the client has never logged any weight
- **WHEN** the client logs weight = 75 kg for today
- **THEN** the entry is created and the dashboard reflects the first reading

---

### REQ-DWT-02: Weight History Display

The system SHALL display a paginated list of weight entries in the client's activity view, ordered by date descending.

| Column | Content |
|--------|---------|
| Date | Human-readable (e.g., "Apr 18, 2026") |
| Weight | Value in kg with one decimal place |
| Notes | Full notes text, or "—" if empty |

#### Scenario: Client views weight history with entries
- **GIVEN** the client has logged weight on several dates
- **WHEN** the client navigates to the activity view and selects the weight section
- **THEN** a table of entries is shown, most recent first, with date, weight (kg), and notes

#### Scenario: Client has no weight entries
- **GIVEN** the client has never logged any weight
- **WHEN** the client navigates to the activity view and selects the weight section
- **THEN** the system displays an empty state: "No weight logged yet"

#### Scenario: Coach views client weight history
- **GIVEN** the coach is viewing a client's activity page
- **WHEN** the coach selects the weight section
- **THEN** the coach sees the same weight history table in read-only mode

---

### REQ-DWT-03: Weekly Average Calculation

The system SHALL compute a 7-day rolling average for any given calendar week using forward-fill from the nearest previous entry.

**Fill algorithm**:
1. For each day in the 7-day window (Mon–Sun or Sun–Sat), use the actual entry if it exists.
2. If no entry for a day, fill with the most recent entry on a previous day within the same week (forward-fill).
3. If no previous entry exists in the week at all (first days have no prior data), carry forward from the last known entry before the week started.
4. If no entry exists anywhere before or during the week, that day contributes 0 to the average.
5. If ALL days resolve to 0 (no entries anywhere in or before the week), the average is `null`.

| Input | Expected Average |
|-------|-----------------|
| Mon=80, Wed=82, no others in week | (80+80+82+82+82+82+82)/7 ≈ 81.7 kg |
| No entries entire week, last known = 78 kg day before | (78×7)/7 = 78 kg |
| No entries ever before or during week | null |

#### Scenario: Partial week entries — forward-fill applied
- **GIVEN** entries: Mon=80 kg, Wed=82 kg (Tue, Thu–Sun have no entry)
- **WHEN** the system calculates the week average
- **THEN** Tue is filled with 80 (carry from Mon), Thu–Sun are filled with 82 (carry from Wed), average = (80+80+82+82+82+82+82)/7 ≈ 81.7 kg

#### Scenario: No entries for entire week, prior data exists
- **GIVEN** the client has an entry on the Sunday before the current week: 78 kg
- **GIVEN** no entries exist for the current week (Mon–Sun)
- **WHEN** the system calculates the week average
- **THEN** all 7 days are filled with 78 kg, average = 78 kg

#### Scenario: No entries whatsoever
- **GIVEN** the client has never logged any weight
- **WHEN** the system calculates the week average for any week
- **THEN** average = null (not zero)

---

### REQ-DWT-04: Weight Metrics

The system SHALL display computed metrics (minimum, maximum, average) for the selected period (week or month) in the activity view, alongside a trend chart.

| Metric | Definition |
|--------|-----------|
| Minimum | Lowest actual logged weight in the period |
| Maximum | Highest actual logged weight in the period |
| Average | Weekly rolling average computed per REQ-DWT-03, aggregated across the period |
| Trend chart | Line chart with one data point per day; uses forward-filled values for continuity |

#### Scenario: Client views weekly metrics with entries
- **GIVEN** the client has logged weight on multiple days this week
- **WHEN** the client views the activity view on the "Week" period selector
- **THEN** the system displays accurate min, max, and average values, plus a trend chart

#### Scenario: Client views monthly metrics
- **GIVEN** the client has logged weight across the current month
- **WHEN** the client switches to "Month" on the period selector
- **THEN** metrics update to reflect the full month range

#### Scenario: Client views metrics for a period with no data
- **GIVEN** the client has no weight entries for the selected period
- **WHEN** the client views metrics
- **THEN** min, max, and average all display "—" or "N/A", and the chart shows an empty state

---

## Out of Scope

- Weight goal setting (target weight is read from the client profile, not set here)
- Unit conversion (kg only in v1)
- Bulk import of historical entries
- Sharing weight data externally
