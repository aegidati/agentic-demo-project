# Prompt 17 - Context Restore & Next Step

## Context
Restore feature lifecycle status after a pause and identify the single next mandatory step in the Feature Delivery Sequence.

## Prompt To Run In Copilot Chat
@feature-orchestrator
Ask only for the feature number (XXXX).
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, read 00-REQUEST.md, 01-PLAN.md,
02-TEST-STRATEGY.md, 03-IMPLEMENTATION-LOG.md (if present), 04-REVIEW.md
(if present), 05-DONE.md (if present), plus any referenced ADRs.
Produce a context-restore summary including:
- feature ID and feature name
- current stage (00-REQUEST, 01-PLAN, 02-TEST-STRATEGY, 03-IMPLEMENTATION, 04-REVIEW, 05-DONE)
- completed increments vs planned increments
- current increment (if in implementation)
- open blockers with severity
- next mandatory step in FEATURE-DELIVERY-SEQUENCE
- recommended prompt to run next (10/11/12/13/14/15/16/17/18)

Apply these rules:
- do not consider an increment complete without evidence in 03-IMPLEMENTATION-LOG.md
- if stage prerequisites are missing, report invalid transition
- if 04-REVIEW.md contains open blockers, do not allow closure in 05-DONE

## Done Criteria
1. Current stage is identified explicitly.
2. Next mandatory step is indicated unambiguously.
3. Blockers and documentation gaps are listed with required action.
4. Next recommended prompt is ready to execute.
5. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
