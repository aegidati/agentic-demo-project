# Documentation Routing Map

This document defines where to look first for each documentation topic in this repository.

It is the authoritative map for resolving documentation ownership and source precedence.

---

# 1. Documentation Categories

The documentation system is organized into these categories:

- Platform and ecosystem
- Governance and process
- Architecture and structure
- Architecture decisions (ADR)
- Feature lifecycle artifacts
- Agent system and request routing
- Domain templates
- UX guidance

---

# 2. Authoritative Documents

Use this table to identify the primary source for each topic.

| Category | Primary Authoritative Documents | Secondary References |
|---|---|---|
| Platform and ecosystem | `docs/platform/AI-DEVELOPMENT-PLAYBOOK.md`, `docs/platform/PLATFORM-ARCHITECTURE.md`, `docs/platform/STARTER-ECOSYSTEM.md` | `README.md`, `docs/platform/README.md` |
| Governance and process | `docs/governance/PROJECT-CONSTITUTION.md`, `docs/governance/AGENTIC-WORKFLOW.md`, `docs/governance/DEFINITION-OF-DONE.md`, `docs/governance/CHANGE-MANAGEMENT.md` | `README.md` |
| Architecture and structure | `docs/architecture/ARCHITECTURE-REQUIREMENTS.md`, `docs/architecture/PROJECT-STRUCTURE.md`, `docs/architecture/ARCHITECTURE-ONBOARDING.md`, `docs/architecture/STARTER-PACKS.md` | `docs/architecture/ARCHITECTURE-SNAPSHOT.md`, `app/README.md` |
| Architecture decisions (ADR) | `docs/adr/ADR-INDEX.md`, `docs/adr/ADR-TEMPLATE.md`, project ADR files in `docs/adr/` | `docs/architecture/ARCHITECTURE-SNAPSHOT.md` |
| Feature lifecycle artifacts | `docs/features/README.md`, `docs/governance/AGENTIC-WORKFLOW.md` | `docs/governance/DEFINITION-OF-DONE.md` |
| Agent system and request routing | `docs/platform/AGENT-RESPONSIBILITIES.md`, `docs/routing/AGENT-ROUTING.md`, `docs/routing/REQUEST-PATTERNS.md` | `README.md`, `.github/agents/` |
| Documentation routing rules | `docs/routing/ROUTING-MAP.md` | none |
| Domain templates | `docs/domain-templates/README.md`, domain files under `docs/domain-templates/**` | `docs/architecture/ARCHITECTURE-REQUIREMENTS.md` |
| UX guidance | `docs/ux/UX-GUIDELINES.md` | feature docs under `docs/features/` |

---

# 3. Routing Rules by Topic

Use these rules to select the correct source quickly.

## Starter installation and canonical paths

Read first:

- `docs/architecture/STARTER-PACKS.md`
- `docs/platform/STARTER-ECOSYSTEM.md`

Then verify onboarding usage in:

- `docs/architecture/ARCHITECTURE-ONBOARDING.md`
- `app/README.md`

Canonical starter paths:

- `agentic-clean-backend` -> `app/backend`
- `agentic-react-spa` -> `app/web`
- `agentic-flutter-client` -> `app/client`
- `agentic-api-contracts-api` -> `app/contracts`
- `agentic-postgres-dev` -> `app/infra`
- `agentic-fullstack-composition` -> `app/composition`

## Workflow, quality gates, and release readiness

Read first:

- `docs/governance/AGENTIC-WORKFLOW.md`
- `docs/governance/DEFINITION-OF-DONE.md`
- `docs/governance/RELEASE-CHECKLIST.md`

## Architecture constraints and structural decisions

Read first:

- `docs/architecture/ARCHITECTURE-REQUIREMENTS.md`
- `docs/architecture/PROJECT-STRUCTURE.md`

If a decision must be recorded:

- `docs/adr/ADR-TEMPLATE.md`
- `docs/adr/ADR-INDEX.md`

## Agent ownership and request routing

Read first:

- `docs/platform/AGENT-RESPONSIBILITIES.md`
- `docs/routing/AGENT-ROUTING.md`
- `docs/routing/REQUEST-PATTERNS.md`

## Domain modeling guidance

Read first:

- `docs/domain-templates/README.md`
- selected bounded-context files under `docs/domain-templates/**`

Keep governance/process rules in governance docs, not in domain models.

## UX guidance

Read first:

- `docs/ux/UX-GUIDELINES.md`

---

# 4. Conflict Resolution Between Sources

When documents disagree, apply this precedence order.

1. Governance and constitution documents in `docs/governance/`
2. ADR decisions in `docs/adr/` (accepted ADRs override generic guidance)
3. Architecture requirements in `docs/architecture/`
4. Platform and routing documents in `docs/platform/` and `docs/routing/`
5. Local guidance in `README.md` and `app/README.md`

Additional resolution rules:

- If `README.md` conflicts with specialized docs, specialized docs win.
- If two specialized docs conflict at the same level, prefer the one closer to the topic scope:
	- starter topic -> `docs/architecture/STARTER-PACKS.md`
	- agent routing topic -> `docs/routing/AGENT-ROUTING.md`
	- workflow topic -> `docs/governance/AGENTIC-WORKFLOW.md`
- If an accepted ADR conflicts with a non-ADR document, the ADR wins.
- If no authoritative source exists, create or update the relevant source document before extending secondary docs.

---

# 5. Maintenance Rules for This Map

- Update this map when new documentation categories are added.
- Keep this map focused on source ownership and precedence.
- Do not duplicate full process or architecture content here.
