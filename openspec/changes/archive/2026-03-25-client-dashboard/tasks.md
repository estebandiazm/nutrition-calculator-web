## 1. Setup & Shared UI Components

- [ ] 1.1 Update `tailwind.config.ts` with custom colors (`surface-dim`, `primary`, etc.) from Stitch design
- [ ] 1.2 Create `src/components/ui/GlassCard.tsx` base component
- [ ] 1.3 Create `src/components/ui/NeonButton.tsx` base component

## 2. Layout & Route Shell

- [ ] 2.1 Create top-level page `app/(client-portal)/dashboard/page.tsx`
- [ ] 2.2 Create `src/components/layout/TopAppBar.tsx`
- [ ] 2.3 Create `src/components/layout/BottomNavBar.tsx`
- [ ] 2.4 Update login/callback redirect to point clients to `/dashboard`
- [ ] 2.5 Delete legacy viewer route at `app/(client-portal)/my-plan`

## 3. Domain Specific Components

- [ ] 3.1 Implement `StepsCounter.tsx`
- [ ] 3.2 Implement `HydrationTracker.tsx`
- [ ] 3.3 Implement `MacrosHUD.tsx`
- [ ] 3.4 Implement `MealCard.tsx` (with accordion, mock search, and macro breakdown)
- [ ] 3.5 Implement `SnacksAndSups.tsx`

## 4. Integration & Polishing

- [ ] 4.1 Assemble components in `dashboard/page.tsx` using static/stubbed data based on the Stitch layout.
- [ ] 4.2 Verify responsive layout (mobile stacking vs desktop grid).
