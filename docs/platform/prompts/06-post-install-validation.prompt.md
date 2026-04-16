# Prompt 06 - Post Install Validation

## Context
Run starter-aware checks and confirm bootstrap integrity.

## Prompt To Run In Copilot Chat
@project-auditor Run validation using scripts/run-checks.cmd and scripts/postinstall-checks.ps1. Provide per-check and per-starter PASS/FAIL/SKIP results, classify not-applicable checks as SKIP with reason, and summarize unresolved blockers. If either script is missing, generate and validate an equivalent safe check workflow before reporting results.

## Done Criteria
1. Validation executes from repository root.
2. PASS/FAIL/SKIP results are reported per check and per starter.
3. If Docker CLI is present but daemon is unreachable, infra/composition checks are classified as SKIP with explicit reason and execution continues.
4. React SPA validation detects partial installations early (metadata + minimal source/test completeness when test scripts require tests) and reports clear reasons.
5. No unresolved FAIL remains, or blockers are explicitly reported.
