---
applyTo: "**"
---

# Starter Assembly Instructions

When assembling an Agentic project:

- Always map each starter to its official target path.
- Inspect starter.manifest.yaml before making changes.
- Respect ownedPaths declared by the starter.
- Treat dependencies as soft unless explicitly documented otherwise.
- Prefer installation in this order when multiple starters are requested:
  1. agentic-api-contracts-api
  2. agentic-clean-backend or agentic-dotnet-backend
  3. agentic-react-spa or agentic-angular-spa or agentic-flutter-client or agentic-react-native
  4. agentic-postgres-dev
  5. agentic-fullstack-composition

Backend and web are alternative starters per slot canonico, so keep canonical install paths unchanged.

If a starter path already exists:
- inspect before changing
- do not overwrite blindly
- explain merge strategy
- if canonical path already contains files, inspect and merge safely before proceeding
