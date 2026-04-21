# Prompt 11 - Feature Plan

## Context
Create the feature plan document from an approved request.

## Prompt To Run In Copilot Chat
@feature-orchestrator Chiedi solo il numero feature (XXXX).
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, leggi 00-REQUEST.md nella cartella risolta e crea
01-PLAN.md con: increment list con owner per ciascuno, dependencies,
ADR references, rollback strategy.

## Done Criteria
1. 01-PLAN.md esiste.
2. Contiene: incrementi, dipendenze, ADR references, rollback strategy.
3. Nessuna assumption business-specifica introdotta senza base nel 00-REQUEST.
4. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
