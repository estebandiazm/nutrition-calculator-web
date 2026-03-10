# Implementation Tasks: Persist Client Data

This document breaks down the implementation of the data persistence feature into actionable tasks based on the `design.md` architecture.

## Phase 1: Database Setup & Modeling
- [x] **Task 1.1: Install Dependencies**
  - Install `mongoose` library.
  - *File(s):* `package.json`
- [x] **Task 1.2: Database Connection Utility**
  - Create a utility function to connect to MongoDB Atlas, ensuring the connection is cached during development hot-reloads to prevent connection spikes.
  - *File(s):* `src/lib/db/mongodb.ts`
- [x] **Task 1.3: Define Environment Variables**
  - Add `MONGODB_URI` to `.env.local` (and `.env.example` if it exists).
- [x] **Task 1.4: Create Mongoose Models**
  - Translate the Zod schemas/TypeScript interfaces (`Client`, `DietPlan`, `Meal`, etc.) into Mongoose schemas as defined in the design document.
  - Ensure `DietPlan` is embedded within the `Client` schema.
  - *File(s):* `src/lib/models/Client.ts`

## Phase 2: Server Actions (Backend)
- [x] **Task 2.1: Client CRUD Actions**
  - Implement Next.js Server Actions to handle database operations securely from the server.
  - Actions needed: `createClient`, `getClients`, `getClientById`, `updateClient`.
  - *File(s):* `src/app/actions/clientActions.ts`
- [x] **Task 2.2: Save Diet Plan Action**
  - Implement a specific Server Action `addDietPlanToClient(clientId, dietPlanData)` that pushes a new diet plan to a client's `plans` array.
  - *File(s):* `src/app/actions/clientActions.ts`

## Phase 3: Frontend - Client Management UI
- [x] **Task 3.1: Clients List Page**
  - Create a new route `/clients` to display a list or grid of all registered clients.
  - Fetch data using the `getClients` server action.
  - *File(s):* `src/app/clients/page.tsx`
- [x] **Task 3.2: Client Detail Page**
  - Create a dynamic route `/clients/[id]` to show a specific client's details.
  - Display the client's historical diet plans.
  - *File(s):* `src/app/clients/[id]/page.tsx`

## Phase 4: Frontend - Diet Creator Integration
- [x] **Task 4.1: "Save to Client" Modal Component**
  - Create a UI component (Modal/Dialog) that allows the nutritionist to either select an existing client from a dropdown or enter a new client's name.
  - *File(s):* `src/components/creator/SavePlanModal.tsx`
- [x] **Task 4.2: Integrate Modal into Creator**
  - Add a "Save Plan" button to the main `Creator` view that opens the modal.
  - Connect the modal's submission to the `addDietPlanToClient` (or `createClient` if it's a new client) server action, passing the generated `DietPlan` JSON.
  - *File(s):* `src/components/creator/Creator.tsx`

## Phase 5: Polish & Verification
- [x] **Task 5.1: Error Handling & Loading States**
  - Ensure UI provides feedback while saving to the database (loading spinners) and handles potential DB connection errors gracefully.
- [x] **Task 5.2: Type Consistency Check**
  - Verify that the data returned from Mongoose (especially `_id` vs `id` and dates) aligns correctly with the frontend `Client` and `DietPlan` TypeScript types.