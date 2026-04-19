# Skill Registry — fitmetrik-web

Generated: 2026-04-03

---

## User Skills

| Skill | Trigger |
|-------|---------|
| `nextjs-15` | When working with Next.js — routing, Server Actions, data fetching |
| `react-19` | When writing React components — no useMemo/useCallback needed |
| `typescript` | When writing TypeScript code — types, interfaces, generics |
| `tailwind-4` | When styling with Tailwind — cn(), theme variables, no var() in className |
| `zod-4` | When using Zod for validation — breaking changes from v3 |
| `playwright` | When writing E2E tests — Page Objects, selectors, MCP workflow |
| `creating-github-pr` | When creating a PR, generating a commit and push, or mentioning 'create PR', 'open PR', 'submit changes' |
| `ai-sdk-5` | When building AI chat features — breaking changes from v4 |
| `zustand-5` | When managing React state with Zustand |
| `skill-creator` | When creating new skills, adding agent instructions, or documenting patterns for AI |
| `branch-pr` | When creating a pull request, opening a PR, or preparing changes for review |
| `issue-creation` | When creating a GitHub issue, reporting a bug, or requesting a feature |
| `judgment-day` | When "judgment day", "review adversarial", "dual review", "juzgar", "que lo juzguen" |

---

## Project Skills (`.agents/skills/`)

| Skill | Trigger |
|-------|---------|
| `clean-code` | Writing, reviewing, or refactoring any code — readability, naming, functions |
| `conventional-commit` | Generating commit messages following Conventional Commits |
| `nextjs-best-practices` | App Router principles — Server Components, data fetching, routing |
| `pr-creator` | When creating a pull request |
| `react-email` | When creating HTML email templates with React components |
| `supabase-postgres-best-practices` | Writing, reviewing, or optimizing Postgres queries, schema, or DB config |

---

## Project Conventions

| File | Notes |
|------|-------|
| `AGENTS.md` | Architecture decisions, domain model, folder roles, dependency rules, git workflow |
| `CLAUDE.md` | Claude Code–specific entry point — commands, stack, conventions |

Key constraints from AGENTS.md:
- `domain/` NEVER imports from `infrastructure/`, `components/`, or `app/`
- Server Components by default — `'use client'` only for interactivity
- Server Actions for mutations (`src/app/actions/`)
- No business logic in components — delegate to `domain/services/` or hooks
- Zod schemas define all domain entities in `src/domain/types/`
- Code in English; Spanish acceptable for domain strings and block type names
- `kebab-case` for files, `PascalCase` for types and components

---

## Compact Rules

### nextjs-15
- Use App Router only — no `pages/` directory
- Server Components by default; add `'use client'` only for interactivity (event handlers, hooks, browser APIs)
- Data fetching: `async/await` directly in Server Components; no `useEffect` for data
- Server Actions for mutations: `'use server'` directive, call from forms or client components
- `loading.tsx` and `error.tsx` per route segment for streaming and error boundaries
- Route groups `(auth)`, `(dashboard)`, `(client-portal)` to separate concerns
- Prefer `Link` over `<a>` for navigation

### react-19
- React Compiler handles memoization — no manual `useMemo`, `useCallback`, or `memo()`
- `use()` hook for reading promises and context — replaces `useContext` + async patterns
- Server Actions replace API routes for mutations; call directly from components
- `useFormStatus` and `useActionState` for form state — no custom loading booleans
- `useOptimistic` for optimistic UI updates

### typescript
- Strict mode always on — no `any`, no non-null assertions without justification
- Prefer `interface` for public API shapes, `type` for unions/intersections/utility types
- Infer from Zod schemas: `z.infer<typeof Schema>` instead of manually duplicating types
- `satisfies` operator to validate literals without widening the type
- Avoid `as` casts — fix the root type instead

### tailwind-4
- Use `cn()` (clsx + tailwind-merge) for conditional class merging
- Theme variables in `@theme {}` block — no `tailwind.config.js` for v4
- CSS variables for design tokens: `--color-primary`, `--spacing-*`
- No `var()` in `className` — use theme tokens directly
- `@apply` only in component libraries; prefer utility classes inline

### zod-4
- Breaking: `z.string().min()` error messages changed — always test validation error output
- `z.object()` is still the same; `z.infer<>` unchanged
- Use `z.discriminatedUnion()` for exhaustive union types
- `.parse()` throws, `.safeParse()` returns `{success, data, error}` — use safeParse at boundaries
- `z.coerce.*` for converting env vars and query params

### playwright
- Page Object Model: one class per page/component, methods return Page Objects
- Use `data-testid` attributes as primary selectors
- `test.describe` groups by feature, `test` names describe behavior (not implementation)
- `expect(locator).toBeVisible()` over `.count()` for existence checks
- Parallel tests by default; use `test.serial` only when truly sequential

### clean-code (project)
- Functions < 20 lines; one level of abstraction per function
- Descriptive English names: verbs for functions (`calculatePortions`), nouns for types (`DietPlan`)
- No side effects in pure functions; separate query from command
- Early returns over nested conditionals
- No magic numbers — use named constants

### supabase-postgres-best-practices (project)
- Always use parameterized queries — never string-interpolate user input
- Index foreign keys and columns used in `WHERE`/`ORDER BY`
- Use `LIMIT` on queries that could return unbounded rows
- Prefer `SELECT` only the columns you need — avoid `SELECT *`
- Use Row Level Security (RLS) — always enable on tables with user data
