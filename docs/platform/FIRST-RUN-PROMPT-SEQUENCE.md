# First-Run Prompt Sequence

## Purpose

Provide a deterministic, execution-ready first-run prompt system for repositories derived from this template.

## When To Use

Use this sequence immediately after deriving a new repository and before regular feature delivery starts.

## Ordered Sequence (00..09)

| Step | File | Goal | Expected Output |
|---|---|---|---|
| 00 | [docs/platform/prompts/00-verify-template-base.prompt.md](prompts/00-verify-template-base.prompt.md) | Verify template baseline integrity | Baseline verification summary with deviations or explicit none |
| 01 | [docs/platform/prompts/01-create-project-bootstrap.prompt.md](prompts/01-create-project-bootstrap.prompt.md) | Create project bootstrap manifest | PROJECT-BOOTSTRAP.yaml created from template schema |
| 02 | [docs/platform/prompts/02-install-starters.prompt.md](prompts/02-install-starters.prompt.md) | Install selected starters deterministically | Per-starter install status in canonical paths |
| 02b (optional) | [docs/platform/prompts/02-install-starters.prompt.md](prompts/02-install-starters.prompt.md) | Adopt optional foundation starter (agentic-iam) | Foundation adoption outcome with explicit no-runtime-slot confirmation |
| 03 | [docs/platform/prompts/03-architecture-adr-001.prompt.md](prompts/03-architecture-adr-001.prompt.md) | Record architecture strategy | ADR-001 created and aligned to selected starters |
| 04 | [docs/platform/prompts/04-architecture-snapshot.prompt.md](prompts/04-architecture-snapshot.prompt.md) | Align architecture snapshot | Updated architecture snapshot linked to ADR-001 |
| 05 | [docs/platform/prompts/05-bootstrap-status-update.prompt.md](prompts/05-bootstrap-status-update.prompt.md) | Update bootstrap status | Manifest status updated without schema drift |
| 06 | [docs/platform/prompts/06-post-install-validation.prompt.md](prompts/06-post-install-validation.prompt.md) | Validate starter-aware post-install health | PASS/FAIL/SKIP results per check and per starter |
| 07 | [docs/platform/prompts/07-first-feature-bootstrap.prompt.md](prompts/07-first-feature-bootstrap.prompt.md) | Bootstrap first feature docs | Initial feature lifecycle docs created |
| 08 | [docs/platform/prompts/08-project-initialization-report.prompt.md](prompts/08-project-initialization-report.prompt.md) | Produce initialization report | Consolidated initialization report with outcomes |
| 09 | [docs/platform/prompts/09-final-gate.prompt.md](prompts/09-final-gate.prompt.md) | Run final readiness gate | READY/NOT READY decision with blockers and next action |

## How To Run

1. Open each prompt file in numeric order (00 to 09).
2. Copy the text under "Prompt To Run In Copilot Chat".
3. Run it in Copilot Chat in the derived repository.
4. Confirm the corresponding done criteria before moving to the next step.

## Execution Rules

1. Keep canonical starter mappings unchanged: app/backend, app/web, app/client, app/contracts, app/infra, app/composition.
2. Apply deterministic and minimal changes only.
3. Keep outputs stack-agnostic and governance-first.
4. Treat optional or unavailable checks as not-applicable (SKIP) when appropriate, with clear reasons.
5. Do not introduce business-specific assumptions during bootstrap.
6. Foundation starters are optional and manual-adoption only; never install them into runtime app/* slots.

## Completion Criteria

1. All steps 00..09 are executed in order.
2. PROJECT-BOOTSTRAP.yaml reflects actual bootstrap status.
3. ADR-001 and architecture snapshot are aligned.
4. Post-install validation has no unresolved FAIL outcomes.
5. First feature documentation and initialization report are present.
6. Final gate returns READY, or blockers are explicitly tracked.