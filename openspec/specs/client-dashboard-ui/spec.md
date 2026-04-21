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


<----------------------------------------------------------------------------------------------------------------------- DELTA FROM daily-weight-tracking -->


## ADDED Requirements

### Requirement: Weight Counter Widget (Dashboard)

The system SHALL display a `WeightCounter` widget on the client dashboard showing the client's most recently logged weight alongside their target weight.

| State | Display |
|-------|---------|
| Weight logged at least once | "80 kg / 75 kg" (current / target) |
| No weight logged yet | "No weight logged" |
| No target weight set on profile | Show current weight only; omit target |

The widget SHALL link to `/activity` (weight section) for full history.

#### Scenario: Client with logged weight views dashboard
- **GIVEN** the client has logged weight entries and the most recent is 80 kg
- **GIVEN** the client's target weight is 75 kg
- **WHEN** the client views the dashboard
- **THEN** the WeightCounter widget displays "80 kg / 75 kg" and links to the activity page

#### Scenario: Client with no weight entries views dashboard
- **GIVEN** the client has never logged any weight
- **WHEN** the client views the dashboard
- **THEN** the WeightCounter widget displays "No weight logged" and the link to activity is still present

#### Scenario: Client with no target weight views dashboard
- **GIVEN** the client has logged weight (e.g., 80 kg) but has no target weight set
- **WHEN** the client views the dashboard
- **THEN** the WeightCounter widget displays "80 kg" without a target, no separator shown

---

### Requirement: Weight Activity History (Activity View)

The system SHALL include a weight section in the client activity view, presented alongside the existing steps section, allowing clients to view their weight history, trends chart, and computed metrics.

| UI element | Description |
|------------|-------------|
| Tab or section toggle | Switch between Steps and Weight (or show both if layout allows) |
| History table | Date, weight (kg), notes — see daily-weight-tracking REQ-DWT-02 |
| Trend chart | Line chart per REQ-DWT-04; uses forward-filled values |
| Metrics row | Min, max, average for selected period (week / month) |
| Period selector | Same control as steps — "Week" and "Month" options |

The weight section SHALL reuse the same period selector state as the steps section (changing period affects both).

#### Scenario: Client navigates to activity and selects weight section
- **GIVEN** the client has weight entries logged
- **WHEN** the client navigates to `/activity` and selects the weight section
- **THEN** the system displays the weight history table, trend chart, and metrics row

#### Scenario: Client switches period to Month in activity view
- **GIVEN** the client is viewing the activity view on "Week" period
- **WHEN** the client switches to "Month"
- **THEN** both the steps section and the weight section update their data to reflect the month range

#### Scenario: Weight section empty state
- **GIVEN** the client has no weight entries
- **WHEN** the client navigates to the weight section in the activity view
- **THEN** the system shows "No weight logged yet" with a prompt to log weight from the dashboard
