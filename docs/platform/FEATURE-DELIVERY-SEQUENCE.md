# Feature Delivery Sequence

## Purpose

Provide a deterministic, execution-ready prompt sequence for delivering features
in repositories derived from this template. Extends the First-Run Prompt Sequence
(steps 00–09) with the repeatable feature delivery cycle (steps 10–18).

## When To Use

Use this sequence for every feature after the repository bootstrap is complete
(Final Gate, step 09, returned READY).

## Ordered Sequence (10..18)

| Step | File | Goal | Expected Output |
|---|---|---|---|
| 10 | [docs/platform/prompts/10-new-feature-request.prompt.md](prompts/10-new-feature-request.prompt.md) | Bootstrap feature request document | 00-REQUEST.md created with scope, rationale, acceptance criteria |
| 11 | [docs/platform/prompts/11-feature-plan.prompt.md](prompts/11-feature-plan.prompt.md) | Create feature plan from approved request | 01-PLAN.md with increments, dependencies, ADR references |
| 12 | [docs/platform/prompts/12-test-strategy.prompt.md](prompts/12-test-strategy.prompt.md) | Define test strategy before implementation | 02-TEST-STRATEGY.md with scope, test types, stop conditions |
| 13 | [docs/platform/prompts/13-lifecycle-gate.prompt.md](prompts/13-lifecycle-gate.prompt.md) | Validate gate 02 → 03 | YES/NO decision with explicit blockers |
| 14 (repeat) | [docs/platform/prompts/14-feature-implementation.prompt.md](prompts/14-feature-implementation.prompt.md) | Implement one increment (repeat per increment) | Increment done, tests pass, 03-IMPLEMENTATION-LOG.md updated |
| 15 | [docs/platform/prompts/15-feature-review.prompt.md](prompts/15-feature-review.prompt.md) | Produce review artifact and verify Definition of Done | 04-REVIEW.md with DoD check and open risks |
| 16 | [docs/platform/prompts/16-feature-done.prompt.md](prompts/16-feature-done.prompt.md) | Formally close the feature | 05-DONE.md, feature declared CLOSED, ADR-INDEX updated |
| 17 | [docs/platform/prompts/17-context-restore.prompt.md](prompts/17-context-restore.prompt.md) | Restore lifecycle context and identify the next mandatory step | Current stage, completed/pending increments, blockers, recommended next prompt |
| 18 (optional per increment) | [docs/platform/prompts/18-increment-completion-check.prompt.md](prompts/18-increment-completion-check.prompt.md) | Validate increment completeness before moving on | PASS/FAIL verdict with evidence checklist and remediation actions |

## How To Run

1. Complete steps 00–09 (First-Run Prompt Sequence) before starting any feature.
2. For each new feature, run steps 10–16 as the core lifecycle sequence.
3. Step 14 is the repeating implementation step: run it once per increment listed in 01-PLAN.md.
4. Use step 18 after each run of step 14 to validate increment completion before starting the next increment.
5. Re-run step 13 (lifecycle gate) if scope changes significantly after the initial gate.
6. Use step 17 whenever work resumes after a pause or a new conversation starts.
7. Open each prompt file, copy the text under "Prompt To Run In Copilot Chat",
   and run it in Copilot Chat in Agent mode.
8. Confirm the corresponding done criteria before moving to the next step.

## Execution Rules

1. Never start step 14 without a YES from step 13.
2. Never skip step 12: test strategy must exist before any implementation.
3. Step 14 must be run separately for each increment — do not batch increments.
4. Each run of step 14 must update 03-IMPLEMENTATION-LOG.md with a dedicated section.
5. Steps 10–12 are run once per feature. Step 14 is run once per increment.
6. Step 18 should be run after each increment implementation (step 14) to confirm completeness.
7. Steps 15–16 are run once per feature, after all increments are complete.
8. Do not close a feature (step 16) if 04-REVIEW.md has unresolved blockers.
9. Step 17 is a restoration utility step and does not replace any mandatory lifecycle gate.

## Context Restoration

Use this section when resuming work after a pause or starting a new conversation
on an in-progress feature.

### How To Restore Context

1. Resolve the feature folder from FEAT-XXXX using a unique match on
  docs/features/FEAT-XXXX-* and read:
   - 00-REQUEST.md — to recall scope and acceptance criteria
   - 01-PLAN.md — to identify which increments are planned and their order
   - 02-TEST-STRATEGY.md — to recall test expectations and stop conditions
   - 03-IMPLEMENTATION-LOG.md — to identify which increments are done and their outcomes
   - 04-REVIEW.md (if present) — to check review status
   - 05-DONE.md (if present) — to confirm closure status

2. Identify the current step:
   - If 03-IMPLEMENTATION-LOG.md is missing or empty → resume from step 13 (gate)
   - If 03-IMPLEMENTATION-LOG.md has some but not all increments → resume step 14
     for the next pending increment listed in 01-PLAN.md
   - If all increments are done but 04-REVIEW.md is missing → resume from step 15
   - If 04-REVIEW.md exists but 05-DONE.md is missing → resume from step 16

3. Run step 17 to get an instant status summary before resuming:

  @feature-orchestrator Chiedi solo il numero feature (XXXX). Risolvi
  automaticamente la cartella con pattern docs/features/FEAT-XXXX-*.
  Se il match non e univoco, fermati e chiedi chiarimento. Se il match e
  univoco, produci un context-restore summary con: feature ID, stage corrente
  nel lifecycle Agentic (00-REQUEST / 01-PLAN / 02-TEST-STRATEGY /
  03-IMPLEMENTATION / 04-REVIEW / 05-DONE), incrementi completati,
  incremento corrente, prossima azione raccomandata. Indica il prossimo step
  della FEATURE-DELIVERY-SEQUENCE da eseguire.

4. After receiving the summary, proceed from the identified step.

### Context Restoration Rules

- Never assume an increment is done unless it appears in 03-IMPLEMENTATION-LOG.md
  with Gate 4 evidence (test output).
- Never skip the gate (step 13) re-validation if more than one conversation gap
  has occurred since the last implementation step.
- If ADR-INDEX.md references new ADRs not yet created, create them before
  resuming implementation.
- If the implementation log contains open risks not resolved in a previous
  increment, evaluate them before starting the next one.

## Completion Criteria

1. All increments in 01-PLAN.md are present in 03-IMPLEMENTATION-LOG.md with Gate 4 evidence.
2. 04-REVIEW.md confirms all DEFINITION-OF-DONE criteria are met.
3. 05-DONE.md declares the feature CLOSED.
4. ADR-INDEX.md is up to date.
5. No unresolved blockers remain in any lifecycle document.
6. If step 18 was used, all increment checks are PASS or have tracked remediation closed before step 15.
