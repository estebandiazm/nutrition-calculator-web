# Data Persistence for Clients and Diet Plans

## Context
Currently, the nutrition calculator application operates in-memory or with static data. This prevents nutritionists from saving patient information, reviewing past plans, or tracking progress over time. To make the application truly useful and to validate the business model, we need to persist client data and their associated diet plans.

## Goals
- Set up and connect the application to a NoSQL database (MongoDB Atlas).
- Create a data model to persist the `Client` entity and all its nested `DietPlan` data.
- Implement basic Create, Read, Update, and Delete (CRUD) operations for clients from the UI.
- Enable nutritionists to save a generated diet plan and assign it to a specific client profile.

## Technical Decisions & Architecture
- **Database:** MongoDB Atlas (Free Tier M0). Selected for its flexibility with nested JSON structures (like the diet plans), excellent free tier for MVP validation, and ease of rapid iteration without requiring strict schema migrations compared to SQL databases.
- **ORM / Driver:** Mongoose (or native MongoDB driver for Node.js) used within Next.js Server Actions / API Routes.
- **Data Structure (Core):**
  - `Clients` Collection: Will store the main profile (Name, ID, etc.) and is designed to accommodate future historical data (like weight logs and upcoming check-ups).
  - The `DietPlan` object (including meals, blocks, and food options) will be embedded directly within the Client document. This approach is optimal for the MVP as it simplifies read operations, retrieving the entire client profile and their plans in a single query.
  - Food items within the plans will be stored as "snapshots" (static copies) to preserve the historical integrity of the plan. A separate food dictionary collection may be implemented later strictly for UI autocomplete purposes.

## Out of Scope (For Now)
- Multi-nutritionist authentication (the MVP assumes a single user/nutritionist or unauthenticated test access).
- Complex analytics or graphical dashboards for client history (we are only preparing the data structure to support this in the future).
