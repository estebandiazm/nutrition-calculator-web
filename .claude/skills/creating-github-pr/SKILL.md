---
name: creating-github-pr
description: Guides through creating GitHub Pull Requests by analyzing staged git changes, generating conventional commit titles with gitmoji, and producing structured PR descriptions following a strict template. Use when creating a new PR, generating a commit and push, or when the user mentions 'create PR', 'open PR', 'submit changes', or 'windsurf workflow'. Do NOT use for simple git commits without PR creation (use standard git commit instead).
allowed-tools: "Bash(git:*) Bash(gh:*)"
metadata:
  author: jdiaz
---

# Generate Commit and PR Workflow

Generate a comprehensive PR title and description, then create a Pull Request via GitHub CLI.

## Step 1: Detect and Analyze Staged Changes

Check the current staging area:

```bash
git status --porcelain
```

- If files are marked **A** (added) or **M** (modified): request confirmation before continuing
- Display the list of files that will be included and ask the user to confirm they are correct

## Step 2: Generate the PR Title

Follow the **Conventional Commits** standard with **gitmoji**. The title must be ≤ 50 characters total.

**Format**: `{gitmoji}{type}({domain}): {message}`

**Domain rules**:
- If changes are under `backend-jvm/domains/**`: use the folder name immediately after `domains/`
- If changes are under `backend-jvm/libraries/**`: use the library name

**Gitmoji map**:
| Type | Gitmoji |
|------|---------|
| `feat` (new feature) | ✨ |
| `fix` (bug fix) | 🐛 |
| `refactor` | ♻️ |
| `docs` | 📝 |
| Performance improvement | 🚀 |
| Configuration change | 🔧 |

**Example**: `✨feat(deposits): publish BRE-B key mgmt events`

## Step 3: Collect Required Links

Before generating the description, ask the user for all missing links in a **single message** to avoid multiple interruptions.

Check which of the following were **not** provided in the original request and ask for them together:

| Link | Required? | How to handle if missing |
|------|-----------|--------------------------|
| **Asana task** | Mandatory | Block — do not proceed until provided |
| **Tech Spec (TS)** | Required | Ask for Notion link; accept short justification for why N/A |
| **Release Plan (RP)** | Required | Ask for Notion link; accept short justification for why N/A |

Present all missing ones at once:
> "Before I generate the PR description, I need a few links:
> - 🔴 Asana task link? *(mandatory)*
> - 📐 Tech Spec (TS) Notion link? *(or explain why not applicable)*
> - 🚀 Release Plan (RP) Notion link? *(or explain why not applicable)*"

Wait for the user's response before continuing.

## Step 4: Generate the PR Description

The description **must strictly follow** this template. Replace every `{{ }}` placeholder with generated content using the links collected in Step 3:

````markdown
## What is the purpose of this request?
<!-- Make feature X, solve bug Y, make enhancement Z. Please be succinct but clear enough to understand the goal. -->

{{ comprehensive description of the proposed changes; mention patterns used, refactoring, or standards followed }}

##### Additional documentation
<!-- Please include relevant documents (ADR, Asana task, Slack thread, other PRs, etc) to provide context -->
{{ Replace the following with provided links. Asana task is MANDATORY — ask for it if not provided.

- [ADR Link](http://fixme.addi.com)
- [Asana task link](http://fixme.addi.com)
- Another relevant link
}}

## Where can we find the technical details for this development?
<!-- A technical specification is required for a new initiative. If not required, explain why -->
{{ Replace with the Tech Spec (TS) Notion link — ask for one if not provided.
- [Technical Specification Link](http://fixme.addi.com)
}}

## How is this going to be released?
<!-- If not required, explain why -->
{{ Replace with the Release Plan (RP) Notion link — ask for one if not provided. Add more links if provided.
- [Release plan Link](http://fixme.addi.com)
- Another relevant link
}}

##### Release toggles
<!-- If not required, explain why -->
{{ List Split toggles detected or provided. If none detected/provided, ask for context or explain why not necessary.
- TOGGLE_1
- TOGGLE_2
}}

## What kind of manual tests were/are going to be performed?
<!-- If not required, especially Local, explain why -->
{{ Mark environments where tests were performed. Minimum should be Local [x]. Delete unmarked items if not applicable.
- [x] Local
- [ ] Pre-production
- [ ] Production
}}

## What are the essential parts to review? (Optional)
<!-- Snippets of relevant code or class names to focus the review on -->
{{ Optional: add critical code blocks with explanation. Use gh CLI to get GitHub links to specific lines. }}
````

## Step 5: Present for Confirmation

Output the **PR title** and **PR description** in separate fenced code blocks so the user can copy them independently.

Ask for confirmation before proceeding to execution.

## Step 6: Execute — Commit, Push, and Create PR

After the user confirms:

### 6.1 Check current branch

```bash
git branch --show-current
```

If branch is `master` or `main`, **stop and warn** — do not commit directly to the main branch.

### 6.2 Stage and commit

```bash
# Stage only the files listed in Step 1 (A or M status)
git add <file/path> ...

# Verify staged state
git status --short

# Commit using the generated PR title
git commit -m "<PR_TITLE>"
```

### 6.3 Push branch to remote

```bash
git push -u origin $(git branch --show-current)
```

### 6.4 Determine target branch

Ask the user before creating the PR:
> "Should this PR target `master` or a different branch?"

- If **master**: use `--base master`
- If a specific branch: use `--base <branch-name>` with the name they provide

### 6.5 Create the Pull Request

**If GitHub CLI is available**:
```bash
gh pr create --title "<PR_TITLE>" --base "<TARGET_BRANCH>" --body "<PR_DESCRIPTION>"
```

**If GitHub CLI is NOT available**:
1. Write the description to `pr_description.md`
2. Instruct the user to open GitHub, create the PR manually from the pushed branch targeting `<TARGET_BRANCH>`, and paste the content

## Additional Notes

- Never commit directly to `master` or `main`
- If there are uncommitted changes after the commit, mention them but leave for a follow-up
- Asana task, Tech Spec, and Release Plan links must be explicitly asked for if not provided — do not skip or leave as `fixme` placeholders
- Mark tests with `[x]` only for environments where tests were actually performed
- When in doubt about toggles, ask the user before defaulting to "not required"