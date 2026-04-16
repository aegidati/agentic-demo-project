---
applyTo: "app/backend/**"
---

# Backend Starter Instructions

The backend area is owned by the selected backend starter (agentic-clean-backend or agentic-dotnet-backend) unless explicitly extended by feature modules.

Rules:
- preserve Clean Architecture boundaries
- do not mix infrastructure with domain logic
- do not introduce frontend/runtime composition concerns into backend structure
- keep backend install path fixed at app/backend
