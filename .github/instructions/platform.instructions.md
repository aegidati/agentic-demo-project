# Platform Instructions

This repository follows the **Agentic AI-native development platform**.

Copilot should prioritize the documentation and rules defined in this repository before generating code or architectural suggestions.

---

# 1. Platform Documentation

The development workflow is defined in the platform documentation.

Primary reference:

docs/platform/AI-DEVELOPMENT-PLAYBOOK.md

This document explains:

- how development works in this repository
- how AI agents collaborate
- how the feature lifecycle operates

---

# 2. Architecture Documentation

Architecture rules are defined in:

docs/architecture/

Key documents:

docs/architecture/ARCHITECTURE-REQUIREMENTS.md  
docs/architecture/ARCHITECTURE-SNAPSHOT.md  
docs/architecture/ARCHITECTURE-ONBOARDING.md  

Architecture decisions are recorded in:

docs/adr/

Reference:

docs/adr/ADR-INDEX.md

---

# 3. Governance Rules

Development workflow and quality gates are defined in:

docs/governance/

Important documents:

docs/governance/AGENTIC-WORKFLOW.md  
docs/governance/DEFINITION-OF-DONE.md  
docs/governance/CHANGE-MANAGEMENT.md  
docs/governance/PROJECT-CONSTITUTION.md  

These documents define the expected development lifecycle.

---

# 4. Documentation Routing

Documentation responsibilities and authoritative sources are defined in:

docs/routing/ROUTING-MAP.md

Copilot should consult this document to determine which documentation source is authoritative for a given topic.

---

# 5. Agent System

This repository uses specialized AI agents.

Agent responsibilities are defined in:

docs/platform/AGENT-RESPONSIBILITIES.md

Agent routing rules are defined in:

docs/routing/AGENT-ROUTING.md

Concrete request patterns are defined in:

docs/routing/REQUEST-PATTERNS.md

Copilot should use these documents to determine which agent is responsible for a given task.

---

# 6. Starter Ecosystem

Architecture modules are installed through official starters.

Starter ecosystem documentation:

docs/platform/STARTER-ECOSYSTEM.md  
docs/architecture/STARTER-PACKS.md  

Runtime starter installation must follow the official install paths.

Foundation starters (for example agentic-iam) follow a manual-adoption model and are not installed into runtime `app/*` slots.

---

# 7. Expected Copilot Behavior

When assisting development in this repository, Copilot should:

- consult platform documentation before suggesting implementation
- respect architecture rules and module boundaries
- follow the documented feature lifecycle
- prefer minimal and deterministic changes
- avoid introducing undocumented architecture patterns
- respect agent responsibilities and routing rules

Copilot should prioritize the authoritative documents defined in the documentation routing system.