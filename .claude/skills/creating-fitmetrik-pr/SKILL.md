---
name: creating-fitmetrik-pr
description: Lightweight PR workflow for personal fitmetrik-web project. Analyzes staged changes, generates conventional commit titles with gitmoji, and creates simple PR descriptions with just the essentials (what changed, why, test status). Use when user says 'create PR', 'open PR', or 'submit changes'.
allowed-tools: "Bash(git:*) Bash(gh:*)"
metadata:
  author: jdiaz
  project: fitmetrik-web
---

# Lightweight Fitmetrik PR Workflow

Simple, fast PR creation for solo development. Minimal ceremony, maximum clarity.

## Step 1: Check Staged Changes

```bash
git status --porcelain
```

Display the files that will be committed and ask for quick confirmation.

## Step 2: Generate PR Title

**Format**: `{gitmoji}{type}: {message}` (≤ 50 chars)

| Type | Gitmoji | Example |
|------|---------|---------|
| `feat` | ✨ | ✨feat: add daily weight tracking |
| `fix` | 🐛 | 🐛fix: weight save validation |
| `refactor` | ♻️ | ♻️refactor: simplify weight schema |
| `docs` | 📝 | 📝docs: update API docs |
| Performance | 🚀 | 🚀perf: optimize weight queries |
| Config | 🔧 | 🔧config: update vitest settings |

## Step 3: Generate Lightweight PR Description

Simple template — no mandatory fields, just context:

```markdown
## What changed?
{{ One sentence: what feature/fix/refactor }}

## Why?
{{ Brief reason: user request, bug, performance, cleanup }}

## Test status
- [x] Unit tests pass
- [x] E2E tests pass (or N/A)
- [ ] Manual testing in browser (if UI change)
```

**Optional**: Add a "Notes" section if there's something tricky or non-obvious.

## Step 4: Confirm and Execute

Show the user the title and description. Ask: "¿Continuamos?" (Continue?)

If yes:
1. Check current branch (must NOT be `main` or `main`)
2. Stage files: `git add <files>`
3. Commit: `git commit -m "<TITLE>"`
4. Push: `git push -u origin $(git branch --show-current)`
5. Create PR: `gh pr create --title "<TITLE>" --body "<DESC>" --base main`

If no branch exists upstream yet, the `-u` flag creates it automatically.

## Branch naming

Use `feat/`, `fix/`, or `refactor/` prefix:
- `feat/daily-weight-tracking`
- `fix/login-flicker`
- `refactor/activity-screens`

## That's it

No Asana, no Release Plans, no split toggles. Just ship it.
