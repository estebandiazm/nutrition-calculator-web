# Design: Multi-Role Coach Rename & Unified Login

## Architecture Overview

This change renames the `Nutritionist` aggregate root to `Coach` across all layers (domain, infrastructure, actions, auth, components) and adds the missing `authId` field to the Coach Mongoose schema. The login flow already works for both roles via a single form; the only auth change is updating the role value from `'nutritionist'` to `'coach'` in Supabase metadata and all middleware/action checks.

The rename follows the **dependency rule** strictly: domain first (pure types), then infrastructure (Mongoose models), then server actions, then auth layer (ports, adapters, middleware), then components. TypeScript's compiler drives the cascade -- each layer rename breaks imports in the next layer, making it impossible to miss a reference.

```
Domain Types          Coach.ts, Client.ts (coachId)
       |
Infrastructure        Coach model (authId, collection: 'coaches'), Client model (coachId ref)
       |
Server Actions        coachActions.ts, clientActions.ts (coachId params)
       |
Auth Layer            Role type, SupabaseAuthProvider, middleware, login actions
       |
Components            Creator, SavePlanModal, ClientContext, clients/new/actions
       |
Migration             MongoDB script + Supabase user_metadata update
```

---

## Decision Log

### DEC-001: Explicit MongoDB collection name
**Decision**: Use `{ collection: 'coaches' }` in the Mongoose schema options rather than relying on Mongoose auto-pluralization of the model name.
**Rationale**: Mongoose lowercases and pluralizes the model name automatically (`Coach` -> `coachs`), which is grammatically wrong. Explicit collection naming avoids ambiguity and makes the migration target predictable.
**Alternatives considered**: (a) Name the model `Coache` to trick pluralization -- fragile and confusing. (b) Accept `coachs` -- unprofessional.
**Tradeoffs**: Slightly more verbose schema definition, but eliminates all ambiguity.

### DEC-002: Copy-not-move migration strategy
**Decision**: The migration script copies documents from `nutritionists` to `coaches` and renames fields in `clients`, but does NOT drop the old `nutritionists` collection.
**Rationale**: The app is not in production, but preserving the source collection provides a safety net. A separate cleanup step can drop it after verification.
**Alternatives considered**: (a) In-place rename via `db.nutritionists.renameCollection('coaches')` -- atomic but destructive and doesn't allow field additions. (b) Drop old collection in the same script -- riskier.
**Tradeoffs**: Temporary disk usage for duplicate data (negligible for dev/staging).

### DEC-003: authId added to Coach schema with sparse unique index
**Decision**: Add `authId: { type: String, sparse: true, index: true, unique: true }` to the Coach Mongoose schema, mirroring the Client pattern.
**Rationale**: The Client schema already has `authId` with a sparse index. Coach needs the same pattern for `getCoachByAuthId()` to work. The `sparse` flag allows documents without `authId` (e.g., coaches created before auth linking) to coexist without violating uniqueness.
**Alternatives considered**: (a) Non-unique index -- allows duplicate authId linkage, which is wrong. (b) Required field -- breaks existing seeded data.
**Tradeoffs**: Existing coach documents without `authId` remain valid; they just can't be looked up by auth ID until linked.

### DEC-004: Environment variable rename
**Decision**: Rename `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` to `NEXT_PUBLIC_DEFAULT_COACH_ID`.
**Rationale**: Consistency. All references to "nutritionist" must go, including env vars. Since the app is not in production, there's no backward-compat concern.
**Alternatives considered**: Keep old env var name with an alias -- unnecessary complexity.
**Tradeoffs**: Must update `.env.local` and any deployment configs.

### DEC-005: Seed script rename
**Decision**: Rename `scripts/seed-nutritionist.ts` to `scripts/seed-coach.ts` and update its contents.
**Rationale**: Consistency with the rename. The seed script references the old model name.
**Alternatives considered**: Delete the seed script -- it may still be useful for dev setup.
**Tradeoffs**: None meaningful.

---

## Implementation Plan

### Phase 1: Domain Layer

**File: `src/domain/types/Nutritionist.ts` -> `src/domain/types/Coach.ts`**

Before:
```typescript
export interface Nutritionist {
  name: string;
  email: string;
  authId?: string;
}
```

After:
```typescript
export interface Coach {
  name: string;
  email: string;
  authId?: string;
}
```

**File: `src/domain/types/Client.ts`**

Before:
```typescript
export interface Client {
    name: string;
    targetWeight?: number;
    nutritionistId: string;
    authId?: string;
    plans: DietPlan[];
}
```

After:
```typescript
export interface Client {
    name: string;
    targetWeight?: number;
    coachId: string;
    authId?: string;
    plans: DietPlan[];
}
```

### Phase 2: Infrastructure Layer

**File: `src/lib/models/Nutritionist.ts` -> `src/lib/models/Coach.ts`**

Before:
```typescript
import { Nutritionist as INutritionist } from '../../domain/types/Nutritionist';

export interface NutritionistDocument extends INutritionist, Document {
  createdAt: Date;
  updatedAt: Date;
}

const NutritionistSchema = new Schema<NutritionistDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export const NutritionistModel =
  mongoose.models.Nutritionist ||
  mongoose.model<NutritionistDocument>('Nutritionist', NutritionistSchema);
```

After:
```typescript
import { Coach as ICoach } from '../../domain/types/Coach';

export interface CoachDocument extends ICoach, Document {
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<CoachDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authId: { type: String, sparse: true, index: true, unique: true },
}, {
  timestamps: true,
  collection: 'coaches',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export const CoachModel =
  mongoose.models.Coach ||
  mongoose.model<CoachDocument>('Coach', CoachSchema);
```

Key changes:
- `authId` field added with sparse unique index
- Explicit `collection: 'coaches'` in schema options
- Model registered as `'Coach'`

**File: `src/lib/models/Client.ts`**

Before:
```typescript
export interface ClientDocument extends Omit<IClient, 'plans' | 'nutritionistId' | 'authId'>, Document {
  plans: DietPlan[];
  nutritionistId: mongoose.Types.ObjectId;
  // ...
}

const ClientSchema = new Schema<ClientDocument>({
  // ...
  nutritionistId: { type: Schema.Types.ObjectId, ref: 'Nutritionist', required: true },
  // ...
});
```

After:
```typescript
export interface ClientDocument extends Omit<IClient, 'plans' | 'coachId' | 'authId'>, Document {
  plans: DietPlan[];
  coachId: mongoose.Types.ObjectId;
  // ...
}

const ClientSchema = new Schema<ClientDocument>({
  // ...
  coachId: { type: Schema.Types.ObjectId, ref: 'Coach', required: true },
  // ...
});
```

### Phase 3: Server Actions

**File: `src/app/actions/nutritionistActions.ts` -> `src/app/actions/coachActions.ts`**

Before:
```typescript
import { NutritionistModel, NutritionistDocument } from '../../lib/models/Nutritionist';
import { Nutritionist } from '../../domain/types/Nutritionist';

function toNutritionist(doc: NutritionistDocument): Nutritionist & { id: string } { ... }
export async function createNutritionist(...) { ... }
export async function getNutritionistById(...) { ... }
export async function getNutritionists() { ... }
```

After:
```typescript
import { CoachModel, CoachDocument } from '../../lib/models/Coach';
import { Coach } from '../../domain/types/Coach';

function toCoach(doc: CoachDocument): Coach & { id: string } {
  const plain = JSON.parse(JSON.stringify(doc.toObject()));
  return {
    id: String(plain._id),
    name: plain.name,
    email: plain.email,
    authId: plain.authId,
  };
}

export async function createCoach(data: Pick<Coach, 'name' | 'email'>): Promise<Coach & { id: string }> { ... }
export async function getCoachById(id: string): Promise<(Coach & { id: string }) | null> { ... }
export async function getCoaches(): Promise<(Coach & { id: string })[]> { ... }

// NEW
export async function getCoachByAuthId(authId: string): Promise<(Coach & { id: string }) | null> {
  await dbConnect();
  const doc = await CoachModel.findOne({ authId });
  if (!doc) return null;
  return toCoach(doc);
}
```

**File: `src/app/actions/clientActions.ts`** -- rename all `nutritionistId` references to `coachId`, rename `getClientsByNutritionist` to `getClientsByCoach`.

**File: `src/app/(dashboard)/clients/new/actions.ts`** -- rename `defaultNutritionistId` to `defaultCoachId`, update env var reference to `NEXT_PUBLIC_DEFAULT_COACH_ID`.

### Phase 4: Auth Layer

**File: `src/infrastructure/ports/AuthProvider.ts`**

Before:
```typescript
export type Role = 'nutritionist' | 'client';
```

After:
```typescript
export type Role = 'coach' | 'client';
```

**File: `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts`**

Before:
```typescript
const role: Role = (rawRole === 'nutritionist' || rawRole === 'client') ? rawRole : 'client';
```

After:
```typescript
const role: Role = (rawRole === 'coach' || rawRole === 'client') ? rawRole : 'client';
```

**File: `src/middleware.ts`**

Replace all `'nutritionist'` string comparisons with `'coach'`:
- Line 39: `role === 'nutritionist'` -> `role === 'coach'`
- Line 49: `role === 'nutritionist'` -> `role === 'coach'`
- Line 58 comment: "Prevent clients from accessing dashboard" (keep as-is, it's about clients)
- Line 63: `role === 'nutritionist'` -> `role === 'coach'`
- Line 63 comment: "Prevent nutritionists from accessing client portal" -> "Prevent coaches from accessing client portal"

**File: `src/app/(auth)/login/actions.ts`**

Before:
```typescript
function getRedirectUrl(role: string | undefined): string {
  return role === 'nutritionist' ? '/clients' : '/dashboard';
}
```

After:
```typescript
function getRedirectUrl(role: string | undefined): string {
  return role === 'coach' ? '/clients' : '/dashboard';
}
```

### Phase 5: Components & Imports

All files importing `nutritionistActions`, `Nutritionist` type, or using `nutritionistId`:

| File | Change |
|------|--------|
| `src/components/creator/SavePlanModal.tsx` | `nutritionistId` prop -> `coachId`, import update |
| `src/components/creator/Creator.tsx` | `nutritionistId` usage -> `coachId`, env var reference |
| `src/context/ClientContext.tsx` | Default client object: `nutritionistId` -> `coachId` |
| `src/app/(dashboard)/clients/new/actions.ts` | Import + env var + variable rename |

**Grep patterns to find ALL references:**
```bash
rg -n 'nutritionist' --type ts --type tsx src/
rg -n 'Nutritionist' --type ts --type tsx src/
rg -n 'NUTRITIONIST' --type ts --type tsx src/
```

### Phase 6: Migration Script

New file: `scripts/migrate-nutritionist-to-coach.ts`

```typescript
// Idempotent migration: nutritionists -> coaches, nutritionistId -> coachId in clients
// 1. Connect to MongoDB
// 2. Count documents in 'nutritionists' collection
// 3. Copy all documents to 'coaches' collection (skip if already exist by _id)
// 4. Add authId: null to copied documents (field present but empty)
// 5. Rename 'nutritionistId' to 'coachId' in 'clients' collection
// 6. Verify document counts match
// 7. Log results, do NOT drop 'nutritionists' collection
```

Rename: `scripts/seed-nutritionist.ts` -> `scripts/seed-coach.ts` (update model imports).

---

## Data Model Changes

### Coach Schema (before -> after)

```diff
- Collection: nutritionists (auto-generated by Mongoose)
+ Collection: coaches (explicit)

  {
    _id: ObjectId,
    name: String (required),
    email: String (required, unique),
+   authId: String (sparse, unique, indexed),
    createdAt: Date,
    updatedAt: Date
  }
```

### Client Schema (before -> after)

```diff
  {
    _id: ObjectId,
    name: String (required),
    targetWeight: Number,
-   nutritionistId: ObjectId (ref: 'Nutritionist', required),
+   coachId: ObjectId (ref: 'Coach', required),
    authId: String (sparse, indexed),
    plans: [DietPlanSchema],
    createdAt: Date,
    updatedAt: Date
  }
```

---

## Migration Strategy

### MongoDB Migration

Script: `scripts/migrate-nutritionist-to-coach.ts`

```javascript
// Pseudocode for the idempotent migration
async function migrate() {
  const db = mongoose.connection.db;

  // Phase 1: Copy nutritionists -> coaches
  const nutritionists = db.collection('nutritionists');
  const coaches = db.collection('coaches');

  const srcCount = await nutritionists.countDocuments();
  console.log(`Source: ${srcCount} documents in 'nutritionists'`);

  const existing = await coaches.countDocuments();
  if (existing > 0) {
    console.log(`'coaches' already has ${existing} docs -- skipping copy (idempotent)`);
  } else {
    const docs = await nutritionists.find().toArray();
    if (docs.length > 0) {
      await coaches.insertMany(docs);
    }
  }

  // Phase 2: Add authId field to coaches that don't have it
  await coaches.updateMany(
    { authId: { $exists: false } },
    { $set: { authId: null } }
  );

  // Phase 3: Rename nutritionistId -> coachId in clients
  const clients = db.collection('clients');
  const clientsWithOldField = await clients.countDocuments({ nutritionistId: { $exists: true } });
  if (clientsWithOldField > 0) {
    await clients.updateMany(
      { nutritionistId: { $exists: true } },
      { $rename: { 'nutritionistId': 'coachId' } }
    );
    console.log(`Renamed nutritionistId -> coachId in ${clientsWithOldField} client docs`);
  }

  // Phase 4: Validate
  const dstCount = await coaches.countDocuments();
  console.log(`Destination: ${dstCount} documents in 'coaches'`);

  if (srcCount !== dstCount) {
    console.error(`MISMATCH: source ${srcCount} != destination ${dstCount}`);
    process.exit(1);
  }

  const remainingOldField = await clients.countDocuments({ nutritionistId: { $exists: true } });
  if (remainingOldField > 0) {
    console.error(`MISMATCH: ${remainingOldField} clients still have nutritionistId`);
    process.exit(1);
  }

  console.log('Migration complete. Old "nutritionists" collection preserved.');
}
```

### Supabase Role Migration

For existing test users with `role: 'nutritionist'` in `user_metadata`:

**Option A -- Supabase Dashboard (manual, for few test users):**
1. Go to Authentication > Users
2. For each user with role `nutritionist`, click the user
3. Edit `user_metadata` JSON: change `"role": "nutritionist"` to `"role": "coach"`

**Option B -- Admin API (scripted, for multiple users):**
```typescript
// Using Supabase Admin client with SERVICE_ROLE_KEY
const { data: { users } } = await adminClient.auth.admin.listUsers();
const nutritionists = users.filter(u => u.user_metadata?.role === 'nutritionist');

for (const user of nutritionists) {
  await adminClient.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role: 'coach' }
  });
  console.log(`Updated ${user.email} role to 'coach'`);
}
```

**Option C -- SQL via Supabase SQL Editor:**
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"coach"')
WHERE raw_user_meta_data->>'role' = 'nutritionist';
```

Recommended: **Option C** for simplicity and atomicity. Run in Supabase SQL Editor.

---

## Auth Flow (after change)

1. User visits `/login`, submits email + password (or magic link)
2. Supabase authenticates, returns session with `user_metadata.role` = `'coach'` or `'client'`
3. Login action calls `getRedirectUrl(role)`:
   - `'coach'` -> redirect to `/clients`
   - `'client'` -> redirect to `/dashboard`
4. Middleware intercepts all requests:
   - Unauthenticated + protected route -> redirect to `/login`
   - Authenticated + `/login` -> redirect to role-based home
   - `'coach'` + `/dashboard` -> redirect to `/clients` (RBAC guard)
   - `'client'` + `/clients` -> redirect to `/dashboard` (RBAC guard)
5. Dashboard pages call `getCoachByAuthId(session.user.id)` or `getClientByAuthId(session.user.id)` to load profile

---

## TypeScript Impact

### What the compiler catches automatically

Once `Nutritionist` type is deleted and `Coach` is created, every file importing `Nutritionist` will fail to compile. This is the primary cascade driver:

1. `src/lib/models/Nutritionist.ts` -- import breaks (file renamed)
2. `src/app/actions/nutritionistActions.ts` -- import breaks (file renamed)
3. All files importing from `nutritionistActions` -- import breaks (file renamed)
4. All files using `nutritionistId` on `Client` type -- property does not exist on type

### What the compiler does NOT catch (manual grep required)

1. **String literals**: `'nutritionist'` in middleware, auth adapter, login actions -- these are runtime values, not type-checked against the `Role` type union (TypeScript narrows but doesn't enforce exhaustiveness on raw `user_metadata` reads)
2. **Environment variables**: `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` -- string, no type checking
3. **Comments**: References to "nutritionist" in code comments
4. **MongoDB collection names**: The old model name `'Nutritionist'` in `mongoose.model()` call -- no compile error if you just change the variable name but forget the string

### Grep checklist (run after all changes)

```bash
rg -in 'nutritionist' src/        # Should return 0 results
rg -in 'nutritionist' scripts/    # Should return 0 results (except migration script referencing old collection)
rg -in 'NUTRITIONIST' .env*       # Should return 0 results
```

---

## Files Affected (complete list)

| # | File | Action |
|---|------|--------|
| 1 | `src/domain/types/Nutritionist.ts` | Rename to `Coach.ts`, rename interface |
| 2 | `src/domain/types/Client.ts` | `nutritionistId` -> `coachId` |
| 3 | `src/lib/models/Nutritionist.ts` | Rename to `Coach.ts`, add `authId`, set `collection: 'coaches'` |
| 4 | `src/lib/models/Client.ts` | `nutritionistId` -> `coachId`, ref `'Coach'` |
| 5 | `src/app/actions/nutritionistActions.ts` | Rename to `coachActions.ts`, rename all exports, add `getCoachByAuthId` |
| 6 | `src/app/actions/clientActions.ts` | `nutritionistId` -> `coachId`, `getClientsByNutritionist` -> `getClientsByCoach` |
| 7 | `src/infrastructure/ports/AuthProvider.ts` | Role: `'nutritionist'` -> `'coach'` |
| 8 | `src/infrastructure/adapters/supabase/SupabaseAuthProvider.ts` | Role check update |
| 9 | `src/middleware.ts` | All `'nutritionist'` -> `'coach'` |
| 10 | `src/app/(auth)/login/actions.ts` | `'nutritionist'` -> `'coach'` |
| 11 | `src/components/creator/SavePlanModal.tsx` | `nutritionistId` prop -> `coachId` |
| 12 | `src/components/creator/Creator.tsx` | `nutritionistId` -> `coachId`, env var |
| 13 | `src/context/ClientContext.tsx` | Default `nutritionistId` -> `coachId` |
| 14 | `src/app/(dashboard)/clients/new/actions.ts` | Env var + variable rename |
| 15 | `scripts/seed-nutritionist.ts` | Rename to `seed-coach.ts`, update imports |
| 16 | `scripts/migrate-nutritionist-to-coach.ts` | New file |
| 17 | `.env.local` | `NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID` -> `NEXT_PUBLIC_DEFAULT_COACH_ID` |
