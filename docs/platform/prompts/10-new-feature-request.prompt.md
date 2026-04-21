# Prompt 10 - New Feature Request

## Context
Bootstrap a new feature request document aligned to AGENTIC-WORKFLOW.

## Prompt To Run In Copilot Chat
@new-feature-agent Explicitly ask the user for:
- feature progressive number in XXXX format
- feature name in [NAME] format (kebab-case consistent with the existing convention)
Then create docs/features/FEAT-XXXX-[NAME]/00-REQUEST.md with scope, rationale,
constraints, acceptance criteria, and the list of planned increments.
Before creating the folder, verify that FEAT-XXXX-[NAME] does not already exist,
and that no other feature uses the same XXXX.

## Done Criteria
1. docs/features/FEAT-XXXX-[NAME]/00-REQUEST.md exists.
2. It contains: scope, rationale, constraints, acceptance criteria, increment list.
3. Number (XXXX) and name ([NAME]) are explicitly requested from the user.
4. Feature ID is unique compared to existing features.
