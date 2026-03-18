## 1. Setup Authentication Provider

- [x] 1.1 Configure Supabase project and obtain API keys
- [x] 1.2 Install `@supabase/supabase-js` and `@supabase/ssr` dependencies
- [x] 1.3 Create `AuthProvider` port and concrete adapter (`SupabaseAuthProvider`)

## 2. Implement Unified Login

- [x] 2.1 Create unified login page UI at `app/login/page.tsx`
- [x] 2.2 Implement Next.js Middleware for tracking session and RBAC (Role-Based Access Control)
- [x] 2.3 Update domain entities (`Client`, `Nutritionist`) to include `authId`

## 3. Implement Client Invitation Flow

- [x] 3.1 Create UI in `(dashboard)` for Nutritionist to invite a new client
- [x] 3.2 Implement Server Action calling Supabase Admin API to invite user
- [x] 3.3 Create password setup/reset route for invited clients confirming their account

## 4. Documentation

- [x] 4.1 Update `AGENTS.md` with the new Authentication architecture, explaining the flow and Supabase port details
