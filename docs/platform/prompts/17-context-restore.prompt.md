# Prompt 17 - Context Restore & Next Step

## Context
Restore feature lifecycle status after a pause and identify the single next mandatory step in the Feature Delivery Sequence.

## Prompt To Run In Copilot Chat
@feature-orchestrator
Chiedi solo il numero feature (XXXX).
Risolvi automaticamente il nome cercando una cartella unica con pattern
docs/features/FEAT-XXXX-*.
Se non trovi match o trovi match multipli, fermati e chiedi chiarimento.
Quando il match e univoco, leggi 00-REQUEST.md, 01-PLAN.md,
02-TEST-STRATEGY.md, 03-IMPLEMENTATION-LOG.md (se presente), 04-REVIEW.md
(se presente), 05-DONE.md (se presente), piu eventuali ADR referenziati.
Produci un context-restore summary con:
- feature ID e feature name
- stage corrente (00-REQUEST, 01-PLAN, 02-TEST-STRATEGY, 03-IMPLEMENTATION, 04-REVIEW, 05-DONE)
- incrementi completati vs incrementi pianificati
- incremento corrente (se in implementazione)
- blockers aperti con severita
- prossimo step obbligatorio della FEATURE-DELIVERY-SEQUENCE
- prompt consigliato da eseguire subito (10/11/12/13/14/15/16/17/18)

Applica le regole:
- non considerare completato un incremento senza evidenza in 03-IMPLEMENTATION-LOG.md
- se mancano prerequisiti di stage, segnala transizione non valida
- se 04-REVIEW.md contiene blocker aperti, vieta la chiusura in 05-DONE

## Done Criteria
1. Stage corrente identificato in modo esplicito.
2. Prossimo step obbligatorio indicato in modo univoco.
3. Blockers e gap documentali elencati con azione richiesta.
4. Prompt successivo raccomandato pronto per esecuzione.
5. Cartella feature risolta automaticamente da FEAT-XXXX con match univoco su docs/features/FEAT-XXXX-*.
