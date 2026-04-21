# Prompt 13 - Lifecycle Gate (02 → 03)

## Context
Validate that the feature is ready to move from TEST STRATEGY to IMPLEMENTATION.

## Prompt To Run In Copilot Chat
@feature-lifecycle-agent Chiedi solo il numero feature (XXXX).
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, valida il gate da 02-TEST-STRATEGY a
03-IMPLEMENTATION leggendo 00-REQUEST.md, 01-PLAN.md, 02-TEST-STRATEGY.md e
tutti gli ADR referenziati nel piano. Dichiara YES/NO con blockers espliciti.

## Done Criteria
1. Risposta YES o NO dichiarata esplicitamente.
2. Se YES: 03-IMPLEMENTATION-LOG.md può essere avviato.
3. Se NO: ogni blocker è elencato con motivazione e azione richiesta.
4. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
