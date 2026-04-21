# Prompt 16 - Feature Done

## Context
Formally close the feature and produce the DONE artifact.

## Prompt To Run In Copilot Chat
@feature-orchestrator Ask only for the feature number (XXXX).
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, create 05-DONE.md in the resolved folder.
Verify that 04-REVIEW.md is present and has no open blockers.
Update docs/adr/ADR-INDEX.md if new ADRs were created during this
feature. Declare the feature as CLOSED or NOT READY TO CLOSE with explicit motivation.

## Done Criteria
1. 05-DONE.md exists.
2. Feature is declared CLOSED or NOT READY TO CLOSE with motivation.
3. ADR-INDEX.md is updated if new ADRs are present.
4. No open blocker remains untracked.
5. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
