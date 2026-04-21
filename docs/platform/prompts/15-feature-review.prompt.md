# Prompt 15 - Feature Review

## Context
Produce the review artifact and check Definition of Done before closing.

## Prompt To Run In Copilot Chat
@feature-orchestrator Chiedi solo il numero feature (XXXX).
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, crea 04-REVIEW.md nella cartella risolta.
Verifica tutti gli incrementi in 03-IMPLEMENTATION-LOG.md, controlla alignment
con gli ADR referenziati, valida contro docs/governance/DEFINITION-OF-DONE.md.
Elenca: cosa e done, open risks, recommended next actions.

## Done Criteria
1. 04-REVIEW.md esiste.
2. Contiene verifica esplicita di ogni criterio in DEFINITION-OF-DONE.md.
3. Open risks elencati con priorità.
4. Recommended next actions presenti.
5. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
