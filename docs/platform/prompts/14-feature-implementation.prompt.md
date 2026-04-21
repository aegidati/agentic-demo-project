# Prompt 14 - Feature Implementation (per increment)

## Context
Implement one increment of the feature following all 4 implementation gates.
Repeat this prompt for each increment listed in 01-PLAN.md.

## Prompt To Run In Copilot Chat
@feature-implementer Ask for:
- feature number (XXXX)
- INCREMENT-ID
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, implement increment [INCREMENT-ID] in the resolved feature.
Before any action, read: 00-REQUEST.md, 01-PLAN.md,
02-TEST-STRATEGY.md, 03-IMPLEMENTATION-LOG.md (if present), and all ADRs
referenced in the plan.
Follow the 4 mandatory gates:
  Gate 0: verify preconditions and input
  Gate 1: architecture safety check (no cross-layer violations)
  Gate 2: implementation plan lock
  Gate 3: incremental implementation
  Gate 4: verification with test evidence
Update 03-IMPLEMENTATION-LOG.md with a dedicated section for this increment,
including: scope, gate 0-4 outcome, touched files, ADR alignment, test output,
open risks.

## Done Criteria
1. Increment is implemented and working.
2. Tests pass with explicit output.
3. 03-IMPLEMENTATION-LOG.md is updated with a section for this increment.
4. No architectural boundary violations are introduced.
5. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
