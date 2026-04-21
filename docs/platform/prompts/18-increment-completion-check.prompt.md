# Prompt 18 - Increment Completion Check (Gate 4 Evidence)

## Context
Validate whether one implementation increment is truly complete against plan, test strategy, and implementation evidence.

## Prompt To Run In Copilot Chat
@feature-lifecycle-agent
Ask for:
- feature number (XXXX)
- INCREMENT-ID
Automatically resolve the name by searching for a unique folder matching
docs/features/FEAT-XXXX-*.
If no match is found or multiple matches are found, stop and ask for clarification.
When the match is unique, validate completion of increment
[INCREMENT-ID] in the resolved feature. Read:
- 01-PLAN.md (increment scope and expected outputs)
- 02-TEST-STRATEGY.md (required tests, edge cases, stop conditions)
- corresponding section in 03-IMPLEMENTATION-LOG.md
- any ADRs referenced in the plan

Return PASS or FAIL verdict with:
- evidence checklist: implemented scope, ADR alignment, test evidence, open risks
- mismatches between plan and implementation
- missing tests/edge cases
- minimum remediation actions to reach PASS
- final decision: READY FOR NEXT INCREMENT or NOT READY

Rules:
- automatic FAIL if explicit test evidence is missing
- automatic FAIL if an architectural boundary violation exists
- automatic FAIL if increment scope is partial without approved justification

## Done Criteria
1. PASS/FAIL verdict is explicit and justified.
2. Evidence checklist is completed.
3. Gaps and minimum remediation are clearly listed.
4. Decision READY FOR NEXT INCREMENT or NOT READY is declared explicitly.
5. Feature folder is automatically resolved from FEAT-XXXX with a unique match on docs/features/FEAT-XXXX-*.
