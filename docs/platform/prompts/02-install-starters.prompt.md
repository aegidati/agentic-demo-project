# Prompt 02 - Install Starters

## Context
Install only selected starters using deterministic canonical paths.

Use the official hardened script `scripts/install-starters.ps1` for runtime starter installation.

## Prompt To Run In Copilot Chat
@starter-installer Run the official hardened installer script `scripts/install-starters.ps1` for step 02. Resolve starters from `PROJECT-BOOTSTRAP.yaml` profile-first via `profiles.<profile>.starters`, then apply explicit overrides from `starters.*.repo`. Install only slots where `repo != null`, use only canonical runtime paths `app/backend`, `app/web`, `app/client`, `app/contracts`, `app/infra`, `app/composition`, classify non-empty target collisions as `SKIP` with `collision=yes` without overwrite or delete, use temp cleanup based on `[System.IO.Path]::GetTempPath()` with `Test-Path -LiteralPath` and `Remove-Item -LiteralPath` inside `finally`, keep cleanup non-blocking, and report per-slot results as JSON plus human-readable summary.

## Done Criteria
1. Selected starters are installed only to canonical paths.
2. Collisions are reported with non-destructive `SKIP` handling and `collision=yes`.
3. Resolution order is profile first, then manual overrides.
4. Installation order is fixed: `contracts`, `backend`, `web`, `client`, `infra`, `composition`.
5. Temp cleanup uses `Test-Path -LiteralPath`, `Remove-Item -LiteralPath`, and a `finally` block, and cleanup failures do not flip a successful slot to `FAIL`.
6. A per-slot installation report is produced with `slot`, `repo`, `path`, `result`, `collision`, and `reason`.
7. The final output includes both machine-readable JSON and a human-readable summary.

## Optional Foundation Adoption

### 02b - Optional IAM Foundation Adoption

#### Prompt To Run In Copilot Chat (02b)
@starter-installer Adopt agentic-iam as an optional foundation starter using manual copy or subtree-vendor (docs + governance artifacts). Do not run scripts/install-starters.ps1 for this step. Do not install it into runtime canonical paths: app/backend, app/web, app/client, app/contracts, app/infra, app/composition. Use an explicit IAM repository URL (or explicit owner/repo), do not infer owner from origin. If IAM repository is missing or inaccessible, mark status as deferred (not failed). Report adopted files, collisions, and unresolved decisions.

#### Additional Done Criteria (02b)
5. Foundation adoption status is explicit: `adopted` or `deferred`.
6. Explicit confirmation that no runtime canonical app/* path was used.
7. Foundation collisions are reported without destructive overwrite.
8. IAM repository source is explicit (full URL or explicit owner/repo), never inferred implicitly.
9. If IAM repository is unavailable, final status is `deferred` with rationale and next action.

#### Stop if (02b)
- IAM is placed into a runtime canonical slot.
- Foundation collisions are unresolved.
- Adoption status is ambiguous.
- IAM repository source is implicit (owner/repo inferred automatically).

### 02c - Optional Authentication Foundation Adoption

#### Prompt To Run In Copilot Chat (02c)
@starter-installer Adopt agentic-auth-foundation as an optional foundation starter using manual copy or subtree-vendor (docs + governance artifacts). Confirm agentic-iam is already adopted. Resolve the profile recipe from `docs/profiles/` by first checking whether `docs/profiles/<project.profile>.md` exists before reading it. If the matching file does not exist, do not fail the step: use the closest available profile recipe as reference, record the mapping rationale, and mark the profile recipe item as explicitly deferred (partial deferral). Do not run scripts/install-starters.ps1 for this step. Do not install it into runtime canonical paths: app/backend, app/web, app/client, app/contracts, app/infra, app/composition. Use an explicit auth-foundation repository URL (or explicit owner/repo), do not infer owner from origin. If auth-foundation repository is missing or inaccessible, mark status as deferred (not failed). Report adopted files, collisions, resolved or deferred recipe mapping, and unresolved ADR seeds.

#### Additional Done Criteria (02c)
5. Authentication foundation adoption status is explicit: `adopted` or `deferred`.
6. AGENTIC-IAM prerequisite is validated before 02c execution.
7. Explicit confirmation that no runtime canonical app/* path was used.
8. Foundation collisions are reported without destructive overwrite.
9. Auth-foundation repository source is explicit (full URL or explicit owner/repo), never inferred implicitly.
10. If auth-foundation repository is unavailable, final status is `deferred` with rationale and next action.
11. If `docs/profiles/<project.profile>.md` is missing, output includes the fallback recipe used (if any), mapping rationale, and explicit partial deferral.
12. Output includes promoted ADR seeds or explicit deferrals with rationale.

#### Stop if (02c)
- AGENTIC-IAM is not already adopted.
- project.profile is not set in PROJECT-BOOTSTRAP.yaml.
- Auth foundation is placed into a runtime canonical slot.
- ADR seeds are neither promoted nor explicitly deferred.
- Adoption status is ambiguous.
- Auth foundation repository source is implicit (owner/repo inferred automatically).
