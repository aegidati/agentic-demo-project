# Prompt 00-09 - Bootstrap Orchestrator (Strict-Interactive)

## Context
Run bootstrap prompts in strict-interactive mode, one step at a time, with explicit gate checks and manual confirmation before moving to the next step.
Include optional foundation steps 02b and 02c when in scope.

Run a strict-interactive bootstrap orchestration using repository current state only.

Execution policy:
1. Execute exactly one step at a time.
2. Do not execute the next step automatically.
3. Stop immediately on FAIL.
4. If FAIL, provide minimal remediation actions and do not continue.
5. Ask explicit confirmation before continuing: "Proceed to next step (YES/NO)?"
6. For optional steps (02b, 02c), explicitly decide IN SCOPE or OUT OF SCOPE before execution.
7. If an optional step is OUT OF SCOPE, mark it SKIP with a one-line rationale and continue only after explicit YES.

Prompt sequence and required primary agent:
1. 00  -> docs/platform/prompts/00-verify-template-base.prompt.md            -> project-auditor
2. 01  -> docs/platform/prompts/01-create-project-bootstrap.prompt.md         -> starter-installer
3. 02  -> docs/platform/prompts/02-install-starters.prompt.md                 -> starter-installer
4. 02b -> docs/platform/prompts/02-install-starters.prompt.md (optional IAM)  -> starter-installer
5. 02c -> docs/platform/prompts/02-install-starters.prompt.md (optional AUTH) -> starter-installer
6. 03  -> docs/platform/prompts/03-architecture-adr-001.prompt.md             -> architecture-guardian
7. 04  -> docs/platform/prompts/04-architecture-snapshot.prompt.md             -> architecture-guardian
8. 05  -> docs/platform/prompts/05-bootstrap-status-update.prompt.md           -> documentation-guardian
9. 06  -> docs/platform/prompts/06-post-install-validation.prompt.md           -> project-auditor
10. 07 -> docs/platform/prompts/07-first-feature-bootstrap.prompt.md           -> new-feature-agent
11. 08 -> docs/platform/prompts/08-project-initialization-report.prompt.md     -> documentation-guardian
12. 09 -> docs/platform/prompts/09-final-gate.prompt.md                        -> feature-lifecycle-agent

Optional-step gating rules:
1. Step 02b is optional and may be PASS or SKIP (with rationale).
2. Step 02c is optional and may be PASS or SKIP (with rationale).
3. If 02c is IN SCOPE, 02b must be PASS first.
4. If 02b fails, stop immediately; do not run 02c.

Required output for each step:
1. Step ID and prompt path.
2. Scope decision: REQUIRED, OPTIONAL-IN-SCOPE, or OPTIONAL-OUT-OF-SCOPE.
3. Files created/updated.
4. Acceptance checks with PASS/FAIL/SKIP and evidence.
5. Blockers.
6. Step decision: PASS, FAIL, or SKIP.
7. Question: "Proceed to next step (YES/NO)?"

Final batch summary output:
1. Completed steps with PASS/FAIL/SKIP status.
2. Optional-step decisions for 02b and 02c, with rationale.
3. Stopped step (if any) and blockers.
4. Final batch decision: COMPLETE or INCOMPLETE.

Hard constraints:
1. Do not change canonical runtime path model: app/backend, app/web, app/client, app/contracts, app/infra, app/composition.
2. Do not introduce schema drift in PROJECT-BOOTSTRAP.yaml.
3. Keep documentation in English.
4. Keep changes minimal and deterministic.

## Done Criteria
1. Prompt orchestration is sequential (00, 01, 02, optional 02b, optional 02c, 03..09).
2. Every step has explicit PASS/FAIL/SKIP gate output with evidence.
3. Next-step execution requires explicit YES/NO confirmation.
4. FAIL causes immediate stop and remediation proposal.
5. Optional steps 02b/02c are explicitly classified IN SCOPE or OUT OF SCOPE.
6. If 02c is in scope, 02b PASS is enforced as prerequisite.
7. Final batch summary is produced.

