# Prompt 14 - Feature Implementation (per incremento)

## Context
Implement one increment of the feature following all 4 implementation gates.
Repeat this prompt for each increment listed in 01-PLAN.md.

## Prompt To Run In Copilot Chat
@feature-implementer Chiedi:
- numero feature (XXXX)
- INCREMENT-ID
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, implementa l'incremento [INCREMENT-ID] nella feature
risolta. Prima di ogni azione leggi: 00-REQUEST.md, 01-PLAN.md,
02-TEST-STRATEGY.md, 03-IMPLEMENTATION-LOG.md (se esiste), tutti gli ADR
referenziati nel piano.
Rispetta i 4 gate obbligatori:
  Gate 0: verifica precondizioni e input
  Gate 1: architecture safety check (no cross-layer violations)
  Gate 2: implementation plan lock
  Gate 3: implementazione incrementale
  Gate 4: verifica con evidenza test
Aggiorna 03-IMPLEMENTATION-LOG.md con una sezione per questo incremento,
includendo: scope, gate 0-4 outcome, file toccati, ADR alignment, test output,
open risks.

## Done Criteria
1. Incremento implementato e funzionante.
2. Test passano con output esplicito.
3. 03-IMPLEMENTATION-LOG.md aggiornato con sezione per questo incremento.
4. Nessuna violazione di boundary architetturale introdotta.
5. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
