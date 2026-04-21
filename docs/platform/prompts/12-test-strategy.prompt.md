# Prompt 12 - Test Strategy

## Context
Define the test strategy before any implementation starts.

## Prompt To Run In Copilot Chat
@test-designer Chiedi solo il numero feature (XXXX).
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, leggi 00-REQUEST.md e 01-PLAN.md della cartella
risolta e crea 02-TEST-STRATEGY.md con: test scope, unit/integration/e2e split,
coverage targets, stop conditions, edge cases da coprire.

## Done Criteria
1. 02-TEST-STRATEGY.md esiste.
2. Contiene: scope, test types, coverage targets, stop conditions.
3. Edge cases esplicitati per ogni incremento del piano.
4. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
