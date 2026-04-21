# Prompt 18 - Increment Completion Check (Gate 4 Evidence)

## Context
Validate whether one implementation increment is truly complete against plan, test strategy, and implementation evidence.

## Prompt To Run In Copilot Chat
@feature-lifecycle-agent
Chiedi:
- numero feature (XXXX)
- INCREMENT-ID
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, valida il completamento dell'incremento
[INCREMENT-ID] nella feature risolta. Leggi:
- 01-PLAN.md (scope e output attesi dell'incremento)
- 02-TEST-STRATEGY.md (test richiesti, edge cases, stop conditions)
- sezione corrispondente in 03-IMPLEMENTATION-LOG.md
- eventuali ADR referenziati nel piano

Restituisci verdict PASS o FAIL con:
- evidence checklist: scope realizzato, allineamento ADR, test evidence, rischi aperti
- mismatch tra piano e implementazione
- test/edge cases mancanti
- azioni minime di remediation per arrivare a PASS
- decisione finale: READY FOR NEXT INCREMENT oppure NOT READY

Regole:
- FAIL automatico se manca evidenza test esplicita
- FAIL automatico se c'e violazione di boundary architetturale
- FAIL automatico se scope dell'incremento e parziale senza giustificazione approvata

## Done Criteria
1. Verdict PASS/FAIL esplicito e motivato.
2. Checklist di evidenze compilata.
3. Gap e remediation minime chiaramente elencati.
4. Decisione READY FOR NEXT INCREMENT o NOT READY dichiarata esplicitamente.
5. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
