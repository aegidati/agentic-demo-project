# Bootstrap Runbook

## Purpose

This runbook guides you through bootstrapping a repository derived from agentic-project-template using the official prompt sequence in [docs/platform/prompts](../platform/prompts).

Run this sequence before starting any real feature development.

Key references:
- [docs/platform/FIRST-RUN-PROMPT-SEQUENCE.md](./FIRST-RUN-PROMPT-SEQUENCE.md)
- [docs/platform/PROJECT-BOOTSTRAP.md](./PROJECT-BOOTSTRAP.md)
- [docs/platform/STARTER-PROFILES.md](./STARTER-PROFILES.md)
- [docs/governance/AGENTIC-WORKFLOW.md](../governance/AGENTIC-WORKFLOW.md)

## Operational Rules

1. Run the prompts in order from 00 to 09, including optional step 02b when IAM foundation adoption is in scope, and optional step 02c when Authentication foundation adoption is in scope.
2. Do not start real feature development before completing at least step 06.
3. Use canonical starter paths:
   - app/backend
   - app/web
   - app/client
   - app/contracts
   - app/infra
   - app/composition
   Runtime starters must use these canonical paths. Foundation starters (for example agentic-iam) are adopted manually and must not be installed into runtime app/* slots.
4. Do not use ADD-STARTER-PROFILES for this derived repository: it is a template-evolution prompt, not a project bootstrap prompt.
5. If a step produces blockers, resolve them before continuing.

## Prerequisites

1. Derived repository already open in VS Code.
2. Preliminary architectural profile decision:
   - web-stack
   - mobile-stack
   - mobile-stack-react-native
   - api-stack
   - fullstack-stack
   - fullstack-stack-react-native
   - web-stack-angular
   - api-stack-dotnet
   - fullstack-angular-dotnet
   - fullstack-angular-dotnet-react-native
   - flutter-standalone
   - react-native-standalone
3. Local tooling available based on selected starters:
   - Node.js and npm for JavaScript/TypeScript stacks
   - .NET SDK for .NET backend
   - Docker Desktop for infra/composition
   - PowerShell on Windows

## Quick Profile Guide

1. **web-stack**
   Choose this for a web application with React, Clean Architecture backend, API contracts, and Postgres.

2. **mobile-stack**
   Choose this for a mobile-first project with Flutter, backend, API contracts, and Postgres.

3. **mobile-stack-react-native**
   Choose this for a mobile-first project with React Native, backend, API contracts, and Postgres.

4. **api-stack**
   Choose this for a backend-first project without a frontend.

5. **fullstack-stack**
   Choose this for React web plus Flutter client, with backend, shared contracts, infra, and composition.

6. **fullstack-stack-react-native**
   Choose this for React web plus React Native client, with backend, shared contracts, infra, and composition.

7. **web-stack-angular**
   Choose this if the team works with Angular and .NET.

8. **api-stack-dotnet**
   Choose this for a .NET backend-first project without a frontend.

9. **fullstack-angular-dotnet**
   Choose this for Angular + .NET + Flutter + composition.

10. **fullstack-angular-dotnet-react-native**
   Choose this for Angular + .NET + React Native + composition.

11. **flutter-standalone**
   Choose this for a standalone Flutter client with no backend runtime starters.

12. **react-native-standalone**
   Choose this for a standalone React Native client with no backend runtime starters.

## Full Sequence

### 00 - Verify Template Base

File:
[docs/platform/prompts/00-verify-template-base.prompt.md](./prompts/00-verify-template-base.prompt.md)

Recommended mode:
Ask

Objective:
Verify that the derived repository is a clean template baseline.

Copy-paste chat text:

```text
@project-auditor Verify this derived repository is a clean template baseline. Confirm required template directories and governance docs exist, list any structural deviations, and confirm canonical starter targets are unchanged: app/backend, app/web, app/client, app/contracts, app/infra, app/composition.
```

Expected output:
1. Baseline summary.
2. Any structural deviations, or confirmation that none exist.
3. Confirmation that canonical paths are unchanged.

Stop if:
- Governance documents are missing.
- The structure has been altered.
- Canonical paths no longer match.

### 01 - Create Project Bootstrap

File:
[docs/platform/prompts/01-create-project-bootstrap.prompt.md](./prompts/01-create-project-bootstrap.prompt.md)

Recommended mode:
Agent

Objective:
Create PROJECT-BOOTSTRAP.yaml from the template manifest.

Before running:
If `project.profile` has not been explicitly decided yet, the agent will ask you to choose interactively from the allowed profile list before creating the file. Prepare your choice using [PROJECT-BOOTSTRAP.example.yaml](../../PROJECT-BOOTSTRAP.example.yaml) and [docs/platform/STARTER-PROFILES.md](./STARTER-PROFILES.md).

Copy-paste chat text:

```text
@starter-installer Create PROJECT-BOOTSTRAP.yaml from PROJECT-BOOTSTRAP.example.yaml. Keep schema and keys unchanged. Before creating the file, if the project profile has not been explicitly chosen yet, ask the user to choose one profile from the allowed options below and briefly describe each option so the choice is unambiguous. Do not assume a default when project.profile is null. Allowed profiles: web-stack, mobile-stack, mobile-stack-react-native, api-stack, fullstack-stack, fullstack-stack-react-native, web-stack-angular, api-stack-dotnet, fullstack-angular-dotnet, fullstack-angular-dotnet-react-native, flutter-standalone, react-native-standalone. When creating the file: use project.profile as the recommended default starter selection mechanism, use starters: only for explicit manual overrides, keep unselected manual overrides as repo: null, do not add business-specific fields.
```

Expected output:
1. PROJECT-BOOTSTRAP.yaml created at repository root.
2. Schema identical to the template.
3. `project.profile` explicitly set.
4. `starters:` used only for explicit overrides.

Quick checks:
- `project.name` is set
- `project.profile` is explicitly set (not null)
- `project.profile` is consistent with the chosen stack
- Unused starters left as `repo: null`

### 02 - Install Starters

File:
[docs/platform/prompts/02-install-starters.prompt.md](./prompts/02-install-starters.prompt.md)

Recommended mode:
Agent

Objective:
Install the starters selected in the manifest.

Operational rules for this step:
1. Use the official hardened script: `scripts/install-starters.ps1`.
2. Resolve starters profile-first from `project.profile` via `profiles.<profile>.starters`, then apply explicit overrides from `starters.*.repo`.
3. Install only slots where the resolved `repo` is not `null`.
4. Use only canonical runtime paths: `app/backend`, `app/web`, `app/client`, `app/contracts`, `app/infra`, `app/composition`.
5. Handle collisions non-destructively: if a target slot exists and is not empty, classify it as `SKIP` with `collision=yes`, without overwrite or delete, then continue with remaining slots.
6. Use temp cleanup safety based on `[System.IO.Path]::GetTempPath()` with `Test-Path -LiteralPath`, `Remove-Item -LiteralPath`, and `finally`; cleanup is best-effort and must not turn a successful install into a failure.
7. Produce both machine-readable JSON output and a human-readable per-slot summary.

Copy-paste chat text:

```text
@starter-installer Run the official hardened installer script scripts/install-starters.ps1 for step 02. Resolve starters from PROJECT-BOOTSTRAP.yaml using profile-first resolution via profiles.<profile>.starters, then apply explicit overrides from starters.*.repo. Install only slots where repo != null, enforce canonical runtime paths app/backend, app/web, app/client, app/contracts, app/infra, app/composition, classify non-empty target collisions as SKIP with collision=yes without overwrite/delete, keep temp cleanup best-effort with Test-Path -LiteralPath and Remove-Item -LiteralPath inside finally, and report per-slot results as both JSON and human-readable summary.
```

Installation order:
1. contracts
2. backend
3. web
4. client
5. infra
6. composition

Expected output:
1. Starters installed only in canonical paths.
2. Collisions reported as non-destructive `SKIP` without blind overwrite.
3. Per-slot install status with `slot`, `repo`, `path`, `result`, `collision`, `reason`.
4. Final output includes JSON plus a human-readable summary.

Stop if:
- A starter is proposed at a non-canonical path.
- The official hardened script is bypassed.
- Installed starters are inconsistent with `project.profile`.

### 02b - Optional IAM Foundation Adoption

File:
[docs/platform/prompts/02-install-starters.prompt.md](./prompts/02-install-starters.prompt.md)

Recommended mode:
Agent

Objective:
Adopt AGENTIC-IAM as an optional foundation starter using manual copy or subtree-vendor, without changing runtime canonical slots.

Prompt To Run In Copilot Chat (02b):

```text
@starter-installer Adopt agentic-iam as an optional foundation starter using manual copy or subtree-vendor (docs + governance artifacts). Do not run scripts/install-starters.ps1 for this step. Do not install it into runtime canonical paths (app/backend, app/web, app/client, app/contracts, app/infra, app/composition). Use an explicit IAM repository URL (or explicit owner/repo), do not infer owner from origin. If IAM repository is missing or inaccessible, mark status as deferred (not failed). Report adopted files, collisions, and unresolved decisions.
```

Additional Done Criteria (02b):
1. Foundation adoption status is explicit: `adopted` or `deferred`.
2. Explicit confirmation that no runtime canonical app/* path was used.
3. Foundation collisions are reported without destructive overwrite.
4. IAM repository source is explicit (full URL or explicit owner/repo), never inferred implicitly.
5. If IAM repository is unavailable, final status is `deferred` with rationale and next action.

Stop if (02b):
- IAM is placed into a runtime canonical slot.
- Foundation collisions are unresolved.
- Adoption status is ambiguous.
- IAM repository source is implicit (owner/repo inferred automatically).

### 02c - Optional Authentication Foundation Adoption

File:
[docs/platform/prompts/02-install-starters.prompt.md](./prompts/02-install-starters.prompt.md)

Recommended mode:
Agent

Objective:
Adopt AGENTIC-AUTH-FOUNDATION as an optional foundation starter using manual copy or subtree-vendor, extending the IAM foundation with profile-driven authentication guidance.

Prerequisite:
Step 02b (AGENTIC-IAM adoption) must be completed before this step.

Prompt To Run In Copilot Chat (02c):

```text
@starter-installer Adopt agentic-auth-foundation as an optional foundation starter using manual copy or subtree-vendor (docs + governance artifacts). Confirm agentic-iam is already adopted. Resolve the profile recipe from `docs/profiles/` by first checking whether `docs/profiles/<project.profile>.md` exists before reading it. If the matching file does not exist, do not fail the step: use the closest available profile recipe as reference, record the mapping rationale, and mark the profile recipe item as explicitly deferred (partial deferral). Do not run scripts/install-starters.ps1 for this step. Do not install it into runtime canonical paths: app/backend, app/web, app/client, app/contracts, app/infra, app/composition. Use an explicit auth-foundation repository URL (or explicit owner/repo), do not infer owner from origin. If auth-foundation repository is missing or inaccessible, mark status as deferred (not failed). Report adopted files, collisions, resolved or deferred recipe mapping, and unresolved ADR seeds.
```

Additional Done Criteria (02c):
1. Authentication foundation adoption status is explicit: `adopted` or `deferred`.
2. AGENTIC-IAM prerequisite is validated before 02c execution.
3. Explicit confirmation that no runtime canonical app/* path was used.
4. Foundation collisions are reported without destructive overwrite.
5. Auth-foundation repository source is explicit (full URL or explicit owner/repo), never inferred implicitly.
6. If auth-foundation repository is unavailable, final status is `deferred` with rationale and next action.
7. If `docs/profiles/<project.profile>.md` is missing, output includes the fallback recipe used (if any), mapping rationale, and explicit partial deferral.
8. Output includes promoted ADR seeds or explicit deferrals with rationale.

Stop if (02c):
- AGENTIC-IAM is not already adopted.
- project.profile is not set in PROJECT-BOOTSTRAP.yaml.
- Auth foundation is placed into a runtime canonical slot.
- ADR seeds are neither promoted nor explicitly deferred.
- Adoption status is ambiguous.
- Auth foundation repository source is implicit (owner/repo inferred automatically).

### 03 - Architecture ADR 001

File:
[docs/platform/prompts/03-architecture-adr-001.prompt.md](./prompts/03-architecture-adr-001.prompt.md)

Recommended mode:
Agent

Objective:
Formalize the initial architecture strategy.

Copy-paste chat text:

```text
@architecture-guardian Create docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md documenting selected runtime starters, optional foundation starters, rationale, constraints, and initial architecture decisions. Keep it governance-first and consistent with template boundaries.
```

Expected output:
1. [docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md](../adr/ADR-001-ARCHITECTURE-STRATEGY.md) created.
2. Starter rationale documented.
3. Constraints and initial decisions explicit.

Minimum content to verify:
- Selected starters
- Rationale for the choice
- Team or project constraints
- Decisions on backend, frontend, contracts, infra, and foundation adoption (if any)
- Any deliberate exclusions

### 04 - Architecture Snapshot

File:
[docs/platform/prompts/04-architecture-snapshot.prompt.md](./prompts/04-architecture-snapshot.prompt.md)

Recommended mode:
Agent

Objective:
Align the architecture snapshot to the installed baseline.

Copy-paste chat text:

```text
@architecture-guardian Update docs/architecture/ARCHITECTURE-SNAPSHOT.md to reflect installed starter modules and ADR-001 decisions. Keep it high-level, deterministic, and aligned with canonical starter paths.
```

Expected output:
1. [docs/architecture/ARCHITECTURE-SNAPSHOT.md](../architecture/ARCHITECTURE-SNAPSHOT.md) updated.
2. Link to ADR-001 present.
3. Installed modules correctly described.

Quick checks:
- backend/web/client/contracts/infra/composition listed only if actually installed
- No description that contradicts ADR-001

### 05 - Bootstrap Status Update

File:
[docs/platform/prompts/05-bootstrap-status-update.prompt.md](./prompts/05-bootstrap-status-update.prompt.md)

Recommended mode:
Agent

Objective:
Update bootstrap status flags in the manifest.

Copy-paste chat text:

```text
@documentation-guardian Update PROJECT-BOOTSTRAP.yaml to reflect completed bootstrap status (installation and architecture documentation readiness) without changing schema or adding new keys.
```

Expected output:
1. Status flags updated.
2. No schema drift.
3. No additional keys introduced.

Quick checks:
- `architecture.adr_001_created` set correctly
- `architecture.architecture_snapshot_created` set correctly

### 06 - Post Install Validation

File:
[docs/platform/prompts/06-post-install-validation.prompt.md](./prompts/06-post-install-validation.prompt.md)

Recommended mode:
Ask or Agent

Objective:
Validate bootstrap integrity.

References:
- [scripts/run-checks.cmd](../../scripts/run-checks.cmd)
- [scripts/postinstall-checks.ps1](../../scripts/postinstall-checks.ps1)

Copy-paste chat text:

```text
@project-auditor Run validation using scripts/run-checks.cmd and scripts/postinstall-checks.ps1. Provide per-check and per-starter PASS/FAIL/SKIP results, classify not-applicable checks as SKIP with reason, and summarize unresolved blockers. If either script is missing, generate and validate an equivalent safe check workflow before reporting results.
```

Expected output:
1. PASS/FAIL/SKIP results per check.
2. PASS/FAIL/SKIP results per starter.
3. Residual blockers explicitly listed.

Rule:
Do not proceed if there are unresolved and undocumented FAIL blockers.

### 07 - First Feature Bootstrap

File:
[docs/platform/prompts/07-first-feature-bootstrap.prompt.md](./prompts/07-first-feature-bootstrap.prompt.md)

Recommended mode:
Agent

Objective:
Open the first documentation feature, dedicated to the bootstrap itself.

Copy-paste chat text:

```text
@new-feature-agent Create docs/features/FEAT-0001-INITIAL-BOOTSTRAP with at least 00-REQUEST.md and 01-PLAN.md aligned to AGENTIC-WORKFLOW. Keep scope generic and focused on initialization outcomes.
```

Expected output:
1. Initial feature folder created.
2. 00-REQUEST.md present.
3. 01-PLAN.md present.

Purpose:
Track the bootstrap as the first governed feature so it is recorded in the official lifecycle history.

### 08 - Project Initialization Report

File:
[docs/platform/prompts/08-project-initialization-report.prompt.md](./prompts/08-project-initialization-report.prompt.md)

Recommended mode:
Agent

Objective:
Produce a concise initialization report.

Copy-paste chat text:

```text
@documentation-guardian Create docs/features/FEAT-0001-INITIAL-BOOTSTRAP/03-IMPLEMENTATION-LOG.md summarizing selected starters, install outcome, ADR/snapshot updates, validation outcomes, and pending follow-ups.
```

Expected output:
1. Report created.
2. Installation and validation summarized.
3. Follow-ups explicitly listed.

Minimum content:
- Selected starters
- Installation outcome
- ADR-001 created
- Snapshot updated
- Validation results
- Next steps

### 09 - Final Gate

File:
[docs/platform/prompts/09-final-gate.prompt.md](./prompts/09-final-gate.prompt.md)

Recommended mode:
Ask

Objective:
Declare whether the project is ready to enter normal development or not.

Copy-paste chat text:

```text
@feature-lifecycle-agent Run a final gate and declare READY or NOT READY. Validate structure, documentation consistency, canonical starter paths unchanged (app/backend, app/web, app/client, app/contracts, app/infra, app/composition), optional foundation adoption consistency, no foundation starter forced into runtime slots, and post-install validation outcomes.

Also validate ADR index consistency: scan docs/adr/ for concrete ADR-*.md files (excluding ADR-TEMPLATE.md and ADR-INDEX.md itself), then verify that each file is registered in docs/adr/ADR-INDEX.md with matching ID, title, status, date, and link. Report the following checklist:

ADR Index Consistency Checklist:
- [ ] All concrete ADR files are present in the index table
- [ ] No index row has placeholder status (_Template_) for an existing concrete ADR
- [ ] No index row has placeholder date (TBD) for an existing concrete ADR
- [ ] Each index link resolves to an existing file
- [ ] No index row exists without a corresponding file
```

Expected output:
1. Outcome: READY or NOT READY.
2. Any blockers listed.
3. Immediate next step.

Rule:
Start real feature development only after a READY outcome.

## Final Checklist

1. PROJECT-BOOTSTRAP.yaml exists.
2. Starters are installed at canonical paths.
3. ADR-001 exists.
4. ARCHITECTURE-SNAPSHOT.md is updated.
5. Validation has no open blocking FAILs.
6. FEAT-0001-INITIAL-BOOTSTRAP exists.
7. Final gate is READY, or blockers are clearly documented.
8. If IAM is in scope, AGENTIC-IAM is either adopted via manual model or explicitly deferred with rationale.
9. If Authentication is in scope, AGENTIC-AUTH-FOUNDATION is either adopted via step 02c or explicitly deferred with rationale.

## What to Do After Bootstrap

When the project is READY:

1. Identify the first domain in [docs/domain-templates/README.md](../domain-templates/README.md).
2. Create the first real feature in [docs/features/README.md](../features/README.md).
3. Follow the full lifecycle defined in [docs/governance/AGENTIC-WORKFLOW.md](../governance/AGENTIC-WORKFLOW.md):
   - 00 REQUEST
   - 01 PLAN
   - 02 TEST STRATEGY
   - 03 IMPLEMENTATION LOG
   - 04 REVIEW
   - 05 DONE

## Important Notes

1. [docs/platform/prompts/ADD-STARTER-PROFILES.prompt.md](./prompts/ADD-STARTER-PROFILES.prompt.md) must not be used to bootstrap this derived repository.
2. It is a template-evolution prompt for `agentic-project-template`. The profile functionality is already present in this repo.
3. If you are unsure which profile to choose, stop before step 01. The profile selection is the single most important decision in the bootstrap process.