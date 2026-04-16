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
   - Install each runtime starter into its canonical subdirectory under `app/`:
     - `agentic-clean-backend` -> `app/backend`
       - `agentic-dotnet-backend` -> `app/backend`
     - `agentic-react-spa` -> `app/web`
       - `agentic-angular-spa` -> `app/web`
     - `agentic-flutter-client` or `agentic-react-native` -> `app/client`
     - `agentic-api-contracts-api` -> `app/contracts`
     - `agentic-postgres-dev` -> `app/infra`
     - `agentic-fullstack-composition` -> `app/composition`

   - Optional foundation starter:
     - `agentic-iam` -> manual copy or subtree-vendor (docs + governance artifacts)

    Backend and web are alternative starters per slot canonico while keeping canonical install paths unchanged.

    Foundation starters are manual-adoption modules and are not installed into runtime `app/*` slots.

2. **Document your architecture**:
   - Create `docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md`
   - Update `docs/architecture/ARCHITECTURE-SNAPSHOT.md`

3. **Begin feature development**:
   - Follow [docs/governance/AGENTIC-WORKFLOW.md](docs/governance/AGENTIC-WORKFLOW.md)
   - Use custom agents from `.github/agents/`

### For Template Maintainers

- See [docs/platform/AI-PLATFORM-BOOTSTRAP.md](docs/platform/AI-PLATFORM-BOOTSTRAP.md) for bootstrap guidance

## Validation (Post-Install)

This template includes a starter-aware post-install validation workflow.

Derived repositories inherit these validation scripts automatically when created from this template.
Checks are starter-dependent and adapt to selected or installed modules instead of assuming a fixed stack.

### Prerequisites

- Node.js and npm for JavaScript/TypeScript starters
- .NET SDK for .NET backend starters
- Docker Desktop for infra/composition starters (Docker CLI required; daemon can be temporarily unavailable)
- PowerShell on Windows

### Run The Checks

Windows launcher:

```cmd
.\scripts\run-checks.cmd
```

Direct PowerShell execution:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\postinstall-checks.ps1
```

Optional flags:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\postinstall-checks.ps1 -SkipNpmCiIfNodeModules -KeepInfraUp
```

### Result Labels

- PASS: check executed successfully
- FAIL: check executed and failed
- SKIP: check not applicable or required tooling/starter not present

Checks are starter-dependent and run only for starters that are selected and/or installed.

Additional validation behavior:

- If Docker CLI is available but daemon is unreachable, infra/composition checks report `SKIP` with explicit reason and validation continues safely.
- For `agentic-react-spa`, post-install validation checks starter metadata plus minimum web structure (`src`, web entrypoint, HTML host) before running npm scripts.
- When a React SPA defines a test script without `passWithNoTests`, validation requires test artifacts and reports clear `FAIL` when missing.
- For `agentic-react-native`, validation performs lockfile synchronization before `npm ci` to avoid lock/package mismatch failures on clean environments.

## First-Run Prompt Sequence

Use the execution-ready first-run sequence after deriving a new repository:

- [docs/platform/FIRST-RUN-PROMPT-SEQUENCE.md](docs/platform/FIRST-RUN-PROMPT-SEQUENCE.md)
- Prompt files directory: [docs/platform/prompts/](docs/platform/prompts/)

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
Runtime starter packs populate the canonical subdirectories such as:

- app/backend
- app/web
- app/contracts
- app/infra
- app/composition

Foundation starters (for example `agentic-iam`) are adopted manually via documentation/governance artifacts and do not map to a single runtime `app/*` slot.

## Core Concepts

### Agentic Workflow
Features undergo structured lifecycle: **REQUEST → PLAN → TEST → IMPLEMENTATION → REVIEW → DONE**

See: [docs/governance/AGENTIC-WORKFLOW.md](docs/governance/AGENTIC-WORKFLOW.md)

### Architecture Readiness
Install runtime starter packs to provide your technology stack. Optionally adopt foundation starters for reusable domain and governance baselines. Every decision is documented in ADRs.

See: [docs/architecture/ARCHITECTURE-ONBOARDING.md](docs/architecture/ARCHITECTURE-ONBOARDING.md)

### Custom Agents
The repository currently includes the following agents:
- **starter-installer**: Assembles official starters in canonical paths
- **new-feature-agent**: Initializes canonical feature lifecycle skeletons under `docs/features/<feature-slug>/`
- **feature-lifecycle-agent**: Validates lifecycle progression, completeness, and next allowed step
- **feature-orchestrator**: High-level coordinator for feature workflow across specialized feature agents
- **feature-implementer**: Executes approved features with strict implementation and evidence gates
- **architecture-guardian**: Protects ADRs and architecture
- **documentation-guardian**: Maintains documentation quality
- **test-designer**: Creates test strategies
- **ux-navigator**: Ensures UX consistency
- **domain-template-agent**: Supports domain modeling templates
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
**Last Updated**: 2026-03-13
