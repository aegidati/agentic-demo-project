# Prompt 13 - Lifecycle Gate (02 → 03)

## Context
Validate that the feature is ready to move from TEST STRATEGY to IMPLEMENTATION.

## Prompt To Run In Copilot Chat
@feature-lifecycle-agent Valida il gate da 02-TEST-STRATEGY a 03-IMPLEMENTATION
per FEAT-XXXX. Leggi 00-REQUEST.md, 01-PLAN.md, 02-TEST-STRATEGY.md e tutti gli
ADR referenziati nel piano. Dichiara YES/NO con blockers espliciti.

## Done Criteria
1. Risposta YES o NO dichiarata esplicitamente.
2. Se YES: 03-IMPLEMENTATION-LOG.md può essere avviato.
3. Se NO: ogni blocker è elencato con motivazione e azione richiesta.
