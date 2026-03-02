## 1. Remove Vite Configuration Files

- [x] 1.1 Delete `vite.config.ts` from project root
- [x] 1.2 Delete `index.html` (Vite entry point) from project root
- [x] 1.3 Delete `static.json` (Heroku/Vite SPA routing config)
- [x] 1.4 Delete `tsconfig.node.json` (Vite reference config)
- [x] 1.5 Delete `src/vite-env.d.ts` (Vite type declarations)
- [x] 1.6 Delete `public/vite.svg` and `src/assets/react.svg` (Vite scaffold assets)

## 2. Remove Legacy Dependencies

- [x] 2.1 Uninstall Vite ecosystem: `npm uninstall @vitejs/plugin-react vite`
- [x] 2.2 Uninstall React Router ecosystem: `npm uninstall react-router-dom history`
- [x] 2.3 Uninstall legacy deploy tool: `npm uninstall gh-pages`
- [x] 2.4 Evaluate and uninstall `@babel/core` if no longer needed without Vite
- [x] 2.5 Update `next` to latest `15.x` patch version to resolve CVEs

## 3. Fix .gitignore and Untrack Build Artifacts

- [x] 3.1 Add `package-lock.json` to `.gitignore`
- [x] 3.2 Add `*.tsbuildinfo` to `.gitignore`
- [x] 3.3 Run `git rm --cached tsconfig.tsbuildinfo` to untrack without deleting locally
- [x] 3.4 Run `git rm --cached package-lock.json` to untrack without deleting locally
- [x] 3.5 Verify `.DS_Store` is properly covered by `.gitignore` (currently listed but check root-level file)

## 4. Clean Up tsconfig.json

- [x] 4.1 Remove the `references` array pointing to `tsconfig.node.json`
- [x] 4.2 Verify remaining `compilerOptions` are compatible with Next.js 15 (e.g., `module`, `moduleResolution`)

## 5. Consolidate CSS

- [x] 5.1 Compare `src/styles/global.css` vs `src/app/globals.css` content
- [x] 5.2 Merge any unique styles from `src/styles/global.css` into `src/app/globals.css`
- [x] 5.3 Delete `src/styles/global.css` if fully consolidated
- [x] 5.4 Remove `src/styles/` directory if empty

## 6. Update or Remove CI/CD

- [x] 6.1 Delete or disable `.github/workflows/node.js.yml` (deploys Vite dist with deprecated actions)

## 7. Verification

- [x] 7.1 Run `npm run dev` — Next.js dev server starts without errors
- [x] 7.2 Run `npm run build` — Next.js production build completes successfully
- [x] 7.3 Run `npm audit` — no CRITICAL/HIGH vulnerabilities from Vite/react-router deps
- [x] 7.4 Run `git status` — `tsconfig.tsbuildinfo` and `package-lock.json` not shown as tracked
- [x] 7.5 Verify no source file imports from `react-router-dom`, `vite`, or `history`
- [x] 7.6 Verify the app renders correctly in browser at `localhost:3000`
