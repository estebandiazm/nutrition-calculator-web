## ADDED Requirements

### Requirement: Deterministic Diet Calculation
The system SHALL calculate the exact grams for each selected food item based on a target macronutrient/calorie goal and a pivot food item.

#### Scenario: Calculating food grams
- **WHEN** the user provides a target macro profile and a list of requested foods
- **THEN** the DietEngine adapter calculates the appropriate grams for each item relative to the base pivot and returns a complete `DietPlan` object.

#### Scenario: Outputting standard DietPlan format
- **WHEN** the calculation is complete
- **THEN** the result MUST conform exactly to the `DietPlan` JSON Schema.
