# Prompt 12 - Test Strategy

## Context
Define the test strategy before any implementation starts.

## Prompt To Run In Copilot Chat
@test-designer Ask only for the feature number (XXXX).
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, read 00-REQUEST.md and 01-PLAN.md in the resolved folder
and create 02-TEST-STRATEGY.md with: test scope, unit/integration/e2e split,
coverage targets, stop conditions, edge cases to cover.

## Done Criteria
1. 02-TEST-STRATEGY.md exists.
2. It contains: scope, test types, coverage targets, stop conditions.
3. Edge cases are explicitly defined for each plan increment.
4. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
