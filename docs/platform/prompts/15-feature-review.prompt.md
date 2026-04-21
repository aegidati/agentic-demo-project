# Prompt 15 - Feature Review

## Context
Produce the review artifact and check Definition of Done before closing.

## Prompt To Run In Copilot Chat
@feature-orchestrator Ask only for the feature number (XXXX).
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, create 04-REVIEW.md in the resolved folder.
Verify all increments in 03-IMPLEMENTATION-LOG.md, check alignment with
referenced ADRs, validate against docs/governance/DEFINITION-OF-DONE.md.
List: what is done, open risks, recommended next actions.

## Done Criteria
1. 04-REVIEW.md exists.
2. It contains explicit verification of each criterion in DEFINITION-OF-DONE.md.
3. Open risks are listed with priority.
4. Recommended next actions are present.
5. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
