# CARDfy Codex Repository Instructions

## Git Safety & Checkpoint Protocol

These rules apply to every Codex coding task in this repository.

1. **Never work directly on `main`.**
   - Use the Management-approved task branch.
   - If no task branch exists, stop and report that before making product changes.

2. **Establish a known-good checkpoint before material changes.**
   - Run/inspect `git status` and record the current `HEAD` SHA.
   - If the branch is already clean and the current commit is pushed, that existing commit is the checkpoint. Do **not** create an empty/no-op commit.
   - If there are intentional uncommitted changes that must be preserved, inspect them first and create a scoped checkpoint commit only when they are safe to save. Never commit secrets, local environment files, temporary artifacts, or known-broken generated output merely to create a checkpoint.
   - Ensure the checkpoint commit is pushed to the remote branch before risky work.

3. **Commit in small, meaningful increments.**
   - Prefer one focused commit per verified milestone or logically coherent patch.
   - Keep unrelated cleanup out of the task.
   - After a meaningful verified milestone, push the commit so it exists remotely.

4. **Create an extra safety checkpoint before high-risk work.**
   This includes:
   - database/schema migrations,
   - auth/session changes,
   - permission or tenant/branch isolation changes,
   - payment/order-integrity changes,
   - major architecture changes,
   - broad cross-module refactors.
   The current known-good commit must be pushed before starting that work.

5. **Verify before calling a commit known-good.**
   - Run the smallest relevant tests/checks for the change.
   - Do not label a failing or unverified state as the recovery checkpoint.
   - Final completion still requires the task's full required verification.

6. **Do not rewrite shared history without explicit Management approval.**
   - No `git push --force` / `--force-with-lease`.
   - No destructive `git reset --hard` used as a recovery shortcut.
   - No deleting shared branches or tags.
   - No rebasing a shared task branch in a way that rewrites published commits unless explicitly approved.

7. **Recovery must preserve traceability.**
   - Prefer a new revert/fix commit, or restore only the affected files from the last known-good commit.
   - Before rollback, report the target known-good SHA and what will be reverted if the rollback is material.
   - Do not discard unrelated valid work.

8. **End-of-task Git report.**
   Report:
   - branch name,
   - starting checkpoint SHA,
   - final/head SHA,
   - commits created,
   - tests/checks run,
   - whether all commits were pushed,
   - PR number/status,
   - whether any rollback/revert occurred.

## Existing CARDfy authority

This file does not override CARDfy product, UI, security, or task-specific rules in the Project Brain, active Coding Issue, approved UI source, or `ACTIVE_CODING_TASK.md`. When instructions conflict, stop and surface the conflict rather than improvising.
