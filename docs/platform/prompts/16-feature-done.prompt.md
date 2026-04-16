# Prompt 16 - Feature Done

## Context
Formally close the feature and produce the DONE artifact.

## Prompt To Run In Copilot Chat
@feature-orchestrator Crea docs/features/FEAT-XXXX/05-DONE.md.
Verifica che 04-REVIEW.md sia presente e non abbia blockers aperti.
Aggiorna docs/adr/ADR-INDEX.md se nuovi ADR sono stati creati durante questa feature.
Dichiara la feature CLOSED o NOT READY TO CLOSE con motivazione esplicita.

## Done Criteria
1. 05-DONE.md esiste.
2. Feature dichiarata CLOSED o NOT READY TO CLOSE con motivazione.
3. ADR-INDEX.md aggiornato se nuovi ADR presenti.
4. Nessun blocker aperto non tracciato.
