# Agentic Project Template

An agnostic, governance-driven template for agentic development with GitHub Copilot.

## What Is This?

This is a **template repository** that provides:
- Process governance and architectural readiness
- Custom agents for enforcing development discipline
- Stack-agnostic structure for any technology choice
- Documentation lifecycle and feature tracking
- ADR-driven architecture management

**This template does NOT include application code.** It is installed into derived projects to provide structure and governance.

## Quick Start

### For Derived Projects

1. **Select an architecture**:
   - Review [docs/architecture/STARTER-PACKS.md](docs/architecture/STARTER-PACKS.md)
   - Choose one or more starters
   - Install each starter into its canonical subdirectory under `app/`:
     - `agentic-clean-backend` -> `app/backend`
     - `agentic-react-spa` -> `app/web`
     - `agentic-flutter-client` -> `app/client`
     - `agentic-api-contracts-api` -> `app/contracts`
     - `agentic-postgres-dev` -> `app/infra`
     - `agentic-fullstack-composition` -> `app/composition`

2. **Document your architecture**:
   - Create `docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md`
   - Update `docs/architecture/ARCHITECTURE-SNAPSHOT.md`

3. **Begin feature development**:
   - Follow [docs/governance/AGENTIC-WORKFLOW.md](docs/governance/AGENTIC-WORKFLOW.md)
   - Use custom agents from `.github/agents/`

### For Template Maintainers

- See [docs/platform/AI-PLATFORM-BOOTSTRAP.md](docs/platform/AI-PLATFORM-BOOTSTRAP.md) for bootstrap guidance

## Key Directories

```
docs/
├── governance/              # Process docs (PROJECT-CONSTITUTION, WORKFLOWS, RULES)
├── architecture/            # Architecture readiness (onboarding, requirements, starter packs)
├── adr/                     # Architectural Decision Records (templates, index)
├── features/                # Feature lifecycle artifacts (per feature)
├── routing/                 # API routing, navigation maps
├── ux/                      # UX principles and patterns
└── domain-templates/        # Domain model examples (e.g., Customers)

.github/
└── agents/                  # Custom agents (feature-orchestrator, architecture-guardian, etc.)

app/                         # Reserved for installed starter pack code (empty in template)
starters/                    # Metadata and references to starter packs
```

The `app/` directory is intentionally empty in the template.

Application code appears only after installing starter packs.
Starter packs populate the canonical subdirectories such as:

- app/backend
- app/web
- app/contracts
- app/infra
- app/composition

## Core Concepts

### Agentic Workflow
Features undergo structured lifecycle: **REQUEST → PLAN → TEST → IMPLEMENTATION → REVIEW → DONE**

See: [docs/governance/AGENTIC-WORKFLOW.md](docs/governance/AGENTIC-WORKFLOW.md)

### Architecture Readiness
Install a starter pack to provide your technology stack. Every decision is documented in ADRs.

See: [docs/architecture/ARCHITECTURE-ONBOARDING.md](docs/architecture/ARCHITECTURE-ONBOARDING.md)

### Custom Agents
The repository currently includes the following agents:
- **starter-installer**: Assembles official starters in canonical paths
- **feature-orchestrator**: Manages feature lifecycle
- **architecture-guardian**: Protects ADRs and architecture
- **documentation-guardian**: Maintains documentation quality
- **test-designer**: Creates test strategies
- **ux-navigator**: Ensures UX consistency
- **domain-template**: Supports domain modeling templates
- **project-auditor**: Audits structure and release readiness

See: [.github/agents/](.github/agents/)

### Definition of Done
Clear, enforceable criteria for feature completion.

See: [docs/governance/DEFINITION-OF-DONE.md](docs/governance/DEFINITION-OF-DONE.md)

## Platform Model

Template
↓
Starter Repositories
↓
Generated Project
↓
Feature Lifecycle
↓
Production System

The template defines governance rules and development structure for AI-assisted development.

## Language Policy

- **Technical documentation**: English (copy-ready)
- **Code**: English
- **Brainstorming**: Italian allowed (converted to English in formal docs)

See: [docs/governance/LANGUAGE-POLICY.md](docs/governance/LANGUAGE-POLICY.md)

## For More Information

| Topic | Reference |
|-------|-----------|
| **Getting started** | [docs/architecture/ARCHITECTURE-ONBOARDING.md](docs/architecture/ARCHITECTURE-ONBOARDING.md) |
| **Development process** | [docs/governance/AGENTIC-WORKFLOW.md](docs/governance/AGENTIC-WORKFLOW.md) |
| **Architectural standards** | [docs/architecture/ARCHITECTURE-REQUIREMENTS.md](docs/architecture/ARCHITECTURE-REQUIREMENTS.md) |
| **Making decisions** | [docs/adr/ADR-TEMPLATE.md](docs/adr/ADR-TEMPLATE.md), [ADR-INDEX.md](docs/adr/ADR-INDEX.md) |
| **Applying changes safely** | [docs/governance/CHANGE-MANAGEMENT.md](docs/governance/CHANGE-MANAGEMENT.md) |
| **Bootstrap guidance** | [docs/platform/AI-PLATFORM-BOOTSTRAP.md](docs/platform/AI-PLATFORM-BOOTSTRAP.md) |

## License

[To be specified by project]

## Contributing

All contributions must follow:
- [docs/governance/AGENTIC-WORKFLOW.md](docs/governance/AGENTIC-WORKFLOW.md)
- [docs/governance/DEFINITION-OF-DONE.md](docs/governance/DEFINITION-OF-DONE.md)
- [docs/governance/LANGUAGE-POLICY.md](docs/governance/LANGUAGE-POLICY.md)

---

**Status**: Template (architecture and code to be added in derived projects)  
**Last Updated**: 2026-03-04
