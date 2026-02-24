## ADDED Requirements

### Requirement: Food Database Management
The system SHALL provide a central interface for retrieving defined food items and their properties.

#### Scenario: Retrieving food categories
- **WHEN** the system requests available foods by category
- **THEN** it returns a typed array of `Food` objects matching the requested category (e.g., FRUIT, BASE, COMPLEMENT).

#### Scenario: Centralizing hardcoded data
- **WHEN** a component requires the list of available fruits
- **THEN** it must request it from the FoodDatabase adapter instead of importing raw hardcoded arrays.
