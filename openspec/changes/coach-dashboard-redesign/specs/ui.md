# Spec: Coach Dashboard UI

## Context

The current coach home at `src/app/page.tsx` is a `'use client'` component with a basic MUI card list — no metrics, no sorting, no pagination. The redesign replaces it with a Server Component at `src/app/(dashboard)/clients/page.tsx` that matches the Stitch mockup: three metric cards at the top and a full client roster table below.

---

## Requirements

- **Req 1**: The `/clients` page must be a **Server Component** by default; client-side interactivity (sorting, pagination) is isolated in child Client Components.
- **Req 2**: The page renders **three metric cards**:
  - **Active Clients**: Total count of clients assigned to the current coach.
  - **Pending Plans**: Count of clients with no active diet plan.
  - **Avg. Completion %**: Average plan adherence rate across all clients (mocked as `0%` until real tracking exists).
- **Req 3**: The page renders a **client roster table** with the following columns (in order):
  1. CLIENT (name)
  2. GOAL (target weight)
  3. WEIGHT PROGRESS (mocked — current vs. target)
  4. PLAN STATUS (active plan present or not)
  5. LAST UPDATE (most recent `updatedAt` timestamp)
  6. ACTIONS (view / manage)
- **Req 4**: The table must support **column sorting** (at minimum by CLIENT name and LAST UPDATE).
- **Req 5**: The table must support **pagination** (page size: 10 rows; show total count and page controls).
- **Req 6**: The table must show an **empty state** when the coach has no clients (illustration + CTA to invite first client).
- **Req 7**: The page must fetch only the current coach's clients (see Spec: Data Access & Security).
- **Req 8**: All UI must follow the existing dark theme (`bg-[#0a0f1e]` palette) and MUI 7 + Tailwind v4 conventions.

---

## Scenarios

1. **Scenario: Coach with clients loads the dashboard**
   - Given: A coach with 5 active clients is authenticated
   - When: The coach navigates to `/clients`
   - Then:
     - The "Active Clients" metric card shows `5`
     - The "Pending Plans" card shows the count of clients without a diet plan
     - The client roster table renders exactly 5 rows (one per client)
     - Each row shows: name, target weight, plan status indicator, last updated date, and action controls

2. **Scenario: Coach with no clients sees empty state**
   - Given: A coach with zero assigned clients is authenticated
   - When: The coach navigates to `/clients`
   - Then:
     - The "Active Clients" card shows `0`
     - The "Pending Plans" card shows `0`
     - The client roster table area renders an empty state (no-clients illustration + "Invite your first client" CTA)
     - The table rows area is not rendered

3. **Scenario: Coach sorts the table by client name**
   - Given: The coach has multiple clients with different names loaded in the table
   - When: The coach clicks the CLIENT column header
   - Then:
     - Rows re-order alphabetically (A → Z on first click, Z → A on second click)
     - Sort indicator (arrow) reflects the active sort direction
     - Pagination resets to page 1

4. **Scenario: Coach sorts the table by last update**
   - Given: The coach has clients with different `updatedAt` timestamps
   - When: The coach clicks the LAST UPDATE column header
   - Then: Rows re-order by most-recent-first (desc) on first click, oldest-first (asc) on second click

5. **Scenario: Coach paginates through a large roster**
   - Given: The coach has 25 clients
   - When: The dashboard loads
   - Then:
     - Page 1 shows 10 rows
     - Pagination controls show "1 / 3" and a "Next" button
   - When: The coach clicks "Next"
   - Then: Page 2 renders rows 11–20; "Previous" becomes active

6. **Scenario: Coach clicks an ACTIONS control**
   - Given: The client roster table is visible
   - When: The coach clicks the action button in a client row
   - Then: The coach navigates to that client's detail page (route TBD in design phase)
