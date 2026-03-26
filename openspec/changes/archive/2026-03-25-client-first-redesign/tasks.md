## 1. DietPlan Schema Cleanup

- [x] 1.1 Remove `clientId` and `clientName` from Zod schema in `src/domain/types/DietPlan.ts`
- [x] 1.2 Remove `clientId` and `clientName` from Mongoose sub-schema in `src/lib/models/Client.ts`
- [x] 1.3 Update `SavePlanModal` — added `nutritionistId` prop; `Creator` references verified clean

## 2. Nutritionist Data Model

- [x] 2.1 Create TypeScript interface `Nutritionist` in `src/domain/types/Nutritionist.ts`
- [x] 2.2 Create Mongoose model `Nutritionist` in `src/lib/models/Nutritionist.ts`
- [x] 2.3 Add required `nutritionistId` (ObjectId ref) to Client Mongoose schema
- [x] 2.4 Update `Client` TypeScript interface with required `nutritionistId`

## 3. Nutritionist Server Actions

- [x] 3.1 Create `nutritionistActions.ts` with CRUD actions
- [x] 3.2 Add `getClientsByNutritionist` to `clientActions.ts`
- [x] 3.3 Update `createClient` to require `nutritionistId`

## 4. Route Restructure

- [x] 4.1 Root (`/`) now renders clients list
- [x] 4.2 Creator moved to `/creator/page.tsx`
- [x] 4.3 Deleted old `/clients/page.tsx`
- [x] 4.4 Menu: logo → `/`, "Crear Plan" → `/creator`

## 5. Client Detail — Ver Plan Navigation

- [x] 5.1 "Ver Plan" button added to each plan card
- [x] 5.2 Viewer page supports `clientId` and `planIndex` query params
- [x] 5.3 Viewer falls back to ClientContext when no params

## 6. Verification

- [x] 6.1 `tsc --noEmit` — zero errors
- [x] 6.2 `npm run build` — successful production build
- [ ] 6.3 Manual test: root shows clients, `/creator` shows creator
- [ ] 6.4 Manual test: client detail → Ver Plan → viewer
