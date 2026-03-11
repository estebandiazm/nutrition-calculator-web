## Context

The `persist-client-data` change shipped a working MongoDB persistence layer with Client documents containing embedded DietPlan arrays. However, the app routes still default to the diet creator (`/`), the DietPlan schema carries redundant `clientId`/`clientName` fields, and there is no concept of which nutricionista manages each client.

Current route structure:
- `/` → `Creator` (diet plan generator)
- `/clients` → Clients list page
- `/clients/[id]` → Client detail page
- `/viewer` → Plan viewer

Current data model:
- `Client { name, targetWeight?, plans[] }` — one Mongoose collection
- `DietPlan { clientId, clientName, label, days, recommendations, meals[], snacks[] }` — embedded sub-doc

## Goals / Non-Goals

**Goals:**
- Make the nutricionista's workflow client-first: root (`/`) → clients list → client detail → view/create plans
- Introduce `Nutritionist` as a first-class entity for future multi-user support
- Clean up the DietPlan schema by removing redundant fields
- Keep backward compatibility with existing data in MongoDB (no data migration needed)

**Non-Goals:**
- Authentication or login flow for nutricionistas (future change)
- Multi-tenant isolation between nutricionistas (future — for now all clients are visible)
- Refactoring the Creator component itself
- Changing the plan viewer component

## Decisions

### 1. Route restructure strategy

**Decision**: Swap the content of `/` and `/clients` — root renders the clients list, diet creator moves to `/creator`.

**Rationale**: Minimal file changes. The existing `ClientsPage` component moves to `app/page.tsx`, and the existing `HomePage` (wrapping `Creator`) moves to `app/creator/page.tsx`. No need to introduce redirects or catch-all routes.

**Files affected**:
- `app/page.tsx` — renders clients list (currently at `app/clients/page.tsx`)
- `app/creator/page.tsx` — new route for the diet creator
- `app/clients/page.tsx` — can be removed (content moves to root)
- `Menu.tsx` — update nav links ("Crear Plan" → `/creator`, logo → `/`)

### 2. Nutritionist collection with Client reference

**Decision**: Create a `Nutritionist` Mongoose model in its own collection. `Client` gains a `nutritionistId` field (ObjectId reference, optional for now).

**Rationale**: See proposal analysis. A separate collection supports future nutricionista login, profile management, and the "all my clients" view without data duplication.

**Schema**:
- `Nutritionist { name: string (required), email: string (unique, required) }` + timestamps
- `Client` adds `nutritionistId: ObjectId (ref: 'Nutritionist', required)`

**Why `nutritionistId` is required**: We're in development phase — every client must belong to a nutritionist from the start. This enforces a clean data model and avoids orphaned clients. Existing test data in MongoDB can be dropped and recreated.

### 3. DietPlan schema cleanup

**Decision**: Remove `clientId` and `clientName` fields from both the Zod schema (`DietPlan.ts`) and the Mongoose sub-schema (`Client.ts`).

**Rationale**: These are redundant since DietPlan is embedded inside the Client document. The parent Client already has `_id` and `name`.

**Migration impact**: None. MongoDB doesn't enforce schema on existing documents — old documents with `clientId`/`clientName` will simply carry unused fields. New documents won't include them. No data migration needed.

### 4. Client detail "Ver Plan" navigation

**Decision**: Add a "Ver Plan" button on each plan card in `/clients/[id]` that navigates to `/viewer` passing plan data via query params or state.

**Alternative considered**: Using a modal for plan viewing. Rejected because the existing `/viewer` route already renders the full plan and reusing it avoids duplication.

**Approach**: Pass the client ID and plan index as query params (`/viewer?clientId=X&planIndex=0`). The viewer page loads the client, extracts the plan, and renders it. This keeps data flow server-side and avoids localStorage coupling.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Existing bookmarks/links to `/clients` break | Low impact — app is internal tool. `/clients/[id]` still works. Only the list URL changes. |
| `nutritionistId` is optional → orphaned clients | Acceptable for now. Future auth change will enforce it. Can backfill with a migration script. |
| Plan viewer needs to handle query-param loading | Small change to `viewer/page.tsx`. Fallback to existing behavior if no params. |
| Zod schema changes could break Creator form generation | Creator uses `DietPlan` type for plan output. Removing `clientId`/`clientName` means the Creator no longer needs to set them before saving — `SavePlanModal` already handles the client association. |
