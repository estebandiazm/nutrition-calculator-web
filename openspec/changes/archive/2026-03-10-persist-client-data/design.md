# Technical Design: Data Persistence for Clients and Diet Plans

## 1. Overview
This document outlines the technical design for persisting `Client` and `DietPlan` data using MongoDB Atlas and Next.js. The solution leverages Mongoose as the ODM (Object Data Modeling) library and Next.js Server Actions / API Routes for backend communication.

## 2. Architecture & Tech Stack
- **Database:** MongoDB Atlas (M0 Free Tier)
- **ODM:** Mongoose
- **Backend:** Next.js App Router (Server Actions or standard API routes for CRUD operations)
- **Frontend State:** React Context or localized state to handle client data fetching and mutations.

## 3. Database Schema (Mongoose Models)

We will use an embedded document approach for the MVP to minimize queries. The `DietPlan` and its nested structures (`Meal`, `MealBlock`, `FoodOption`) will be embedded directly inside the `Client` document.

### 3.1 Client Model
```typescript
import mongoose, { Schema, Document } from 'mongoose';

const FoodOptionSchema = new Schema({
  foodName: { type: String, required: true },
  grams: { type: Number, required: true },
  measureUnit: { type: String, default: 'g' },
  notes: { type: String }
}, { _id: false });

const MealBlockSchema = new Schema({
  blockType: { type: String, enum: ['BASE', 'ACOMPAÑAMIENTO', 'GRASA', 'FRUTA'], required: true },
  options: [FoodOptionSchema]
}, { _id: false });

const MealSchema = new Schema({
  mealName: { type: String, required: true },
  blocks: [MealBlockSchema]
}, { _id: false });

const SnackOptionSchema = new Schema({
  optionNumber: { type: Number, required: true },
  description: { type: String, required: true }
}, { _id: false });

const DietPlanSchema = new Schema({
  label: { type: String },
  days: { type: String },
  recommendations: { type: String },
  meals: [MealSchema],
  snacks: [SnackOptionSchema],
  createdAt: { type: Date, default: Date.now }
});

const ClientSchema = new Schema({
  name: { type: String, required: true },
  targetWeight: { type: Number },
  plans: [DietPlanSchema] // Embedded Diet Plans
}, { timestamps: true });

export const ClientModel = mongoose.models.Client || mongoose.model('Client', ClientSchema);
```

## 4. API & Backend Implementation (Next.js)

### 4.1 Database Connection
We will create a standard MongoDB connection utility in `src/lib/db/mongodb.ts` that caches the connection across hot reloads in development.

### 4.2 Server Actions
We will implement the following Server Actions (or API Routes) in `src/app/actions/clientActions.ts`:
- `createClient(data: Partial<Client>)`
- `getClients()`
- `getClientById(id: string)`
- `updateClient(id: string, data: Partial<Client>)`
- `addDietPlanToClient(clientId: string, plan: DietPlan)`

## 5. Frontend Integration
- **Client List View:** A new page (e.g., `/clients`) to list all registered clients.
- **Client Detail View:** A page (e.g., `/clients/[id]`) to view a specific client's details and their past diet plans.
- **Save Plan Flow:** In the current Diet Creator view, add a "Save to Client" button. This will trigger a modal to either select an existing client or create a new one, and then append the generated JSON to the selected client's `plans` array in the database.

## 6. Environment Variables
The following environment variables will be required:
- `MONGODB_URI`: The connection string to the MongoDB Atlas cluster.
