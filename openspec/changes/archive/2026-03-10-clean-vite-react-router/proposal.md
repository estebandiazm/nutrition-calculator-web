## Why

The project was originally built with Vite + React Router and later migrated to Next.js 15 App Router. Legacy config files, dependencies, and build artifacts remain tracked in Git, causing:
- **Security vulnerabilities**: 20+ npm audit findings, including CRITICAL (`@babel/traverse`, `next` outdated deps) and HIGH (`react-router`, `minimatch`, `rollup`, `cross-spawn`). The Dependabot alert for `minimatch` traces to `package-lock.json` exposing transitive deps from Vite/react-router.
- **Unnecessary tracked files**: `tsconfig.tsbuildinfo` (build cache), `package-lock.json` alongside ignored `yarn.lock`, `static.json` (Heroku/Vite), Vite assets (`public/vite.svg`, `src/vite-env.d.ts`).
- **Stale CI/CD**: GitHub Actions workflow (`node.js.yml`) still deploys Vite's `dist/` to GitHub Pages using deprecated actions (`actions/checkout@v2`, `setup-node@v1`, Node 16).
- **Confusing project setup**: Two bundler configs (`vite.config.ts` + Next.js), two router systems (`react-router-dom` + App Router), two CSS entry points (`globals.css` + `global.css`).

Cleaning this up reduces attack surface, eliminates confusion, and establishes Next.js as the single build/deploy system per the architecture decision in `AGENTS.md §4.4`.

## What Changes

- **Remove Vite files**: `vite.config.ts`, `index.html`, `static.json`, `public/vite.svg`, `src/vite-env.d.ts`, `tsconfig.node.json`
- **Remove legacy deps**: `react-router-dom`, `history`, `@vitejs/plugin-react`, `gh-pages`, `@babel/core` (Vite peer dep)
- **Fix .gitignore**: Add `package-lock.json`, `tsconfig.tsbuildinfo`, `.DS_Store` (root already ignored but ensure coverage), `*.tsbuildinfo`
- **Untrack build artifacts**: Remove `tsconfig.tsbuildinfo` and `package-lock.json` from Git tracking
- **Update CI/CD**: Rewrite GitHub Actions workflow for Next.js build (or disable if not deploying yet)
- **Consolidate CSS**: Evaluate `src/styles/global.css` vs `src/app/globals.css` duplication
- **Run `npm audit fix`**: Resolve remaining vulnerabilities after removing legacy deps

## Capabilities

### New Capabilities

_(none — this is a cleanup/hygiene change)_

### Modified Capabilities

_(no spec-level behavior changes — purely infrastructure/tooling)_

## Impact

- **Dependencies**: ~5 packages removed; remaining vulnerabilities reduced significantly by eliminating Vite/react-router dependency trees
- **CI/CD**: GitHub Actions workflow will break if not updated (currently deploys Vite dist, not Next.js)
- **Git history**: `package-lock.json` and `tsconfig.tsbuildinfo` will stop being tracked (one-time untrack commit)
- **Build system**: Only `next build` / `next dev` will work after this change; `vite` commands will no longer be available
- **No source code changes**: No `.tsx`/`.ts` source file imports react-router or vite directly — cleanup is config-only
