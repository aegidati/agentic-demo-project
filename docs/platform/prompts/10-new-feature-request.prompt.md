# Prompt 10 - New Feature Request

## Context
Bootstrap a new feature request document aligned to AGENTIC-WORKFLOW.

## Prompt To Run In Copilot Chat
@new-feature-agent Chiedi esplicitamente all'utente:
- numero progressivo feature nel formato XXXX
- nome feature nel formato [NAME] (kebab-case coerente con la convenzione esistente)
Poi crea docs/features/FEAT-XXXX-[NAME]/00-REQUEST.md con scope, rationale,
constraints, acceptance criteria e lista degli incrementi previsti.
Prima di creare la cartella verifica che FEAT-XXXX-[NAME] non esista gia,
e che non esistano altre feature con lo stesso XXXX.

## Done Criteria
1. docs/features/FEAT-XXXX-[NAME]/00-REQUEST.md esiste.
2. Contiene: scope, rationale, constraints, acceptance criteria, increment list.
3. Numero (XXXX) e nome ([NAME]) sono richiesti esplicitamente all'utente.
4. Feature ID è unico rispetto alle feature esistenti.
