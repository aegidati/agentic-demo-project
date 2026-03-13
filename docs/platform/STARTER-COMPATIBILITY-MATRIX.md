# Starter Compatibility Matrix

| Starter | Requires | Optional | Incompatible |
| --- | --- | --- | --- |
| agentic-clean-backend | agentic-api-contracts-api | agentic-postgres-dev | - |
| agentic-react-spa | agentic-api-contracts-api | - | - |
| agentic-flutter-client | agentic-api-contracts-api | - | - |
| agentic-api-contracts-api | - | - | - |
| agentic-postgres-dev | agentic-clean-backend | - | - |
| agentic-fullstack-composition | agentic-clean-backend + agentic-react-spa | agentic-postgres-dev | - |

Rules:

Contracts should be installed before frontend or backend.

Composition starter assumes backend and web starters are present.

Infrastructure starters are optional.
