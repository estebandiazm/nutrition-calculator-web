## MODIFIED Requirements

### Requirement: Modern Blue Aesthetics
The application layout and components MUST utilize a modern, cohesive blue-toned visual schema emphasizing gradients, transparencies, and readability. New components introduced in the root screen (plan cards, macronutrient inputs, action buttons) MUST adhere to the same visual standards as existing components.

#### Scenario: User navigates the application UI
- **WHEN** the application renders components utilizing the Material UI Theme Provider
- **THEN** the primary color palette MUST reflect deep navy/blue and sky/cyan tones.
- **AND** interactive components (like Buttons or Cards) MUST feature modern aesthetics such as rounded corners, subtle gradients, or glassmorphic transparent backgrounds instead of flat brutalist colors.

#### Scenario: Plan cards render on the root screen
- **WHEN** the root screen displays one or more plan cards
- **THEN** each plan card MUST use a glassmorphic style (semi-transparent background, backdrop blur, rounded corners) consistent with the dark navy color palette
- **AND** input fields within the card (Days, Proteins, Carbs, Fruits, Fats) MUST use rounded pill-shaped borders matching the design prototype

#### Scenario: Action buttons render within a plan card
- **WHEN** "Add Another Meal" and "Save Plan" buttons are displayed at the bottom of a plan card
- **THEN** the buttons MUST use a gradient fill (magenta-to-purple: `#E91E8C → #9C27B0`) with white text
- **AND** the buttons MUST have rounded corners (pill shape) consistent with the glassmorphic card aesthetic
