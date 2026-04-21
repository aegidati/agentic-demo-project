# Prompt 13 - Lifecycle Gate (02 -> 03)

## Context
Validate that the feature is ready to move from TEST STRATEGY to IMPLEMENTATION.

## Prompt To Run In Copilot Chat
@feature-lifecycle-agent Ask only for the feature number (XXXX).
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, validate the gate from 02-TEST-STRATEGY to
03-IMPLEMENTATION by reading 00-REQUEST.md, 01-PLAN.md, 02-TEST-STRATEGY.md,
and all ADRs referenced in the plan. Declare YES/NO with explicit blockers.

## Done Criteria
1. YES or NO response is declared explicitly.
2. If YES: 03-IMPLEMENTATION-LOG.md can be started.
3. If NO: each blocker is listed with reason and required action.
4. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
