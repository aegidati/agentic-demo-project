# Prompt 11 - Feature Plan

## Context
Create the feature plan document from an approved request.

## Prompt To Run In Copilot Chat
@feature-orchestrator Ask only for the feature number (XXXX).
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, read 00-REQUEST.md in the resolved folder and create
01-PLAN.md with: increment list with owner for each increment, dependencies,
ADR references, rollback strategy.

## Done Criteria
1. 01-PLAN.md exists.
2. It contains: increments, dependencies, ADR references, rollback strategy.
3. No business-specific assumptions are introduced without a basis in 00-REQUEST.
4. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
