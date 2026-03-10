## Context

The project was originally a Vite + React SPA and has been migrated to Next.js 15 App Router. The migration left behind legacy files and dependencies that are now tracked in Git:

- **Config files**: `vite.config.ts`, `tsconfig.node.json` (Vite reference), `index.html` (Vite entry), `static.json` (Heroku/Vite SPA routing)
- **Dependencies**: `react-router-dom`, `history`, `@vitejs/plugin-react`, `gh-pages`, `@babel/core`
- **Tracked build artifacts**: `tsconfig.tsbuildinfo`, `package-lock.json` (while `yarn.lock` is gitignored)
- **Vite assets**: `public/vite.svg`, `src/vite-env.d.ts`, `src/assets/react.svg`
- **CI/CD**: GitHub Actions deploys Vite `dist/` to GH Pages with deprecated actions and Node 16

No source file (`.tsx`/`.ts`) imports from `react-router-dom` or `vite` — the migration is code-complete, only config artifacts remain.

Current npm audit: 20+ vulnerabilities. Many trace to Vite's transitive deps (`@babel/traverse` CRITICAL, `rollup` HIGH) and react-router (`@remix-run/router` HIGH). The `next` package also shows vulnerabilities due to being on `15.4.4` instead of latest patched version.

## Goals / Non-Goals

**Goals:**
- Remove all Vite and react-router config files and dependencies
- Fix `.gitignore` to stop tracking build artifacts and lock files
- Untrack files that should never have been committed (`tsconfig.tsbuildinfo`, Vite assets)
- Update or disable the GitHub Actions workflow (currently broken for Next.js)
- Resolve npm audit vulnerabilities by removing unused dependency trees
- Update `next` to latest patched version to resolve its own CVEs

**Non-Goals:**
- Changing any application source code or domain logic
- Migrating from MUI to Tailwind (separate change)
- Setting up a new CI/CD pipeline for Next.js deployment (can be a follow-up)
- Switching from npm to yarn or pnpm (out of scope)

## Decisions

### 1. Lock File Strategy: Ignore `package-lock.json`

**Decision**: Add `package-lock.json` to `.gitignore` and untrack it. Keep `yarn.lock` ignored as-is.

**Rationale**: The project currently ignores `yarn.lock` but tracks `package-lock.json`, which is inconsistent. For a single-dev project, the lock file exposes transitive dependency metadata that triggers Dependabot alerts (like the `minimatch` vulnerability). Lock files are regenerable from `package.json`.

**Alternative considered**: Track `package-lock.json` for deterministic builds. Rejected because there's no CI requiring reproducible installs yet, and the cost (constant Dependabot noise) outweighs the benefit for a solo project.

### 2. GitHub Actions: Disable, Don't Rewrite

**Decision**: Remove or disable the current workflow rather than rewriting it for Next.js.

**Rationale**: The current workflow deploys to GitHub Pages via Vite's `dist/`. Next.js deployment target is undecided (Vercel, self-hosted, etc. — see `AGENTS.md §4.3`). Rewriting the CI now would be premature. Better to delete and create a proper pipeline when the hosting decision is made.

**Alternative considered**: Rewrite for `next build && next export`. Rejected because `next export` has limitations with App Router features (Server Actions, dynamic routes) and the deploy target isn't decided.

### 3. Build Artifact Cleanup: Git rm --cached

**Decision**: Use `git rm --cached` to untrack `tsconfig.tsbuildinfo` and `package-lock.json` without deleting them locally, then add to `.gitignore`.

**Rationale**: These files should exist locally (TypeScript needs `tsbuildinfo` for incremental builds, npm needs `package-lock.json`) but should not be committed. `git rm --cached` removes them from tracking without deleting the local copies.

### 4. Dependency Removal Order

**Decision**: Remove deps in this order: (1) Vite ecosystem, (2) React Router ecosystem, (3) Update remaining deps, (4) Run audit fix.

**Rationale**: Removing Vite first eliminates the largest vulnerability surface (`@babel/traverse` CRITICAL, `rollup` HIGH). Then react-router cleanup eliminates `@remix-run/router` HIGH. Finally, updating `next` to latest patch resolves its own CVEs. This order minimizes risk at each step.

### 5. CSS Consolidation

**Decision**: Keep `src/app/globals.css` (Next.js convention) and remove `src/styles/global.css` if it's duplicated or unused.

**Rationale**: Next.js App Router expects global styles in `app/globals.css` imported from `layout.tsx`. The legacy `src/styles/global.css` was the Vite-era entry point. Need to verify content before removing.

### 6. Next.js Version Update

**Decision**: Update `next` from `15.4.4` to latest `15.x` patch to resolve known CVEs (SSRF, DoS, RCE in React flight protocol).

**Rationale**: The `next` package shows 8 vulnerability advisories. Most are fixed in newer patch versions. Since we're cleaning up security issues, this should be part of the same change.

## Risks / Trade-offs

- **[Risk] GitHub Actions breaks immediately** → Mitigation: We're intentionally removing or disabling it. The current workflow is already non-functional for Next.js anyway.
- **[Risk] `npm install` may change behavior without lock file** → Mitigation: For a solo dev, `package.json` semver ranges are sufficient. When CI is set up later, the lock file strategy can be revisited.
- **[Risk] `tsconfig.tsbuildinfo` removal triggers full recompile** → Mitigation: Only untracked from Git, not deleted locally. TypeScript will regenerate it on next build.
- **[Risk] CSS removal breaks styles** → Mitigation: Verify `src/styles/global.css` content before removing. If it contains unique styles, merge into `app/globals.css` first.
