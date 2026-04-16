# Starter Compatibility Matrix

| Starter | Requires | Optional | Incompatible |
| --- | --- | --- | --- |
| agentic-clean-backend | agentic-api-contracts-api | agentic-postgres-dev | - |
| agentic-dotnet-backend | agentic-api-contracts-api | agentic-postgres-dev | - |
| agentic-react-spa | agentic-api-contracts-api | - | - |
| agentic-angular-spa | agentic-api-contracts-api | - | - |
| agentic-flutter-client | agentic-api-contracts-api | - | - |
| agentic-api-contracts-api | - | - | - |
| agentic-postgres-dev | agentic-clean-backend or agentic-dotnet-backend | - | - |
| agentic-fullstack-composition | (agentic-clean-backend + agentic-react-spa) or (agentic-dotnet-backend + agentic-angular-spa) | agentic-postgres-dev | mixed backend/web pairs not explicitly listed |
| agentic-iam | - | any runtime starter set | - |

Rules:

Contracts should be installed before frontend or backend starters.

Composition starter assumes one of the supported homogeneous backend+web pairs is present:

- agentic-clean-backend + agentic-react-spa
- agentic-dotnet-backend + agentic-angular-spa

Infrastructure starters are optional.

---

agentic-iam is a foundation starter.
It is adopted manually (docs + governance artifacts) and does not map to runtime app/* slots.
