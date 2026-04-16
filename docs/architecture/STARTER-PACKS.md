# Starter Packs

## What is a Starter Pack?

A **starter pack** is a pre-configured template that provides:
- A specific **technology stack** (language, framework, databases)
- **Initial directory structure** under `app/`
- **Minimal working example** (health check endpoint, hello world)
- **Suggested ADR-001** for architecture strategy
- **Build & run instructions**

Foundation starters are also supported as documentation-first modules that provide reusable domain and governance baselines without shipping runtime application code.

## Starter Ecosystem Overview

The platform includes the following starter packs:

- **agentic-clean-backend** - Backend service with Clean Architecture
- **agentic-dotnet-backend** - Backend service for .NET-based architectures
- **agentic-react-spa** - React single-page application for web clients
- **agentic-angular-spa** - Angular single-page application for web clients
- **agentic-flutter-client** - Flutter application for cross-platform clients (mobile, web, desktop)
- **agentic-react-native** - React Native application for mobile clients
- **agentic-postgres-dev** - PostgreSQL database infrastructure setup
- **agentic-api-contracts-api** - OpenAPI contract definitions for API integration
- **agentic-fullstack-composition** - Orchestration layer for full-stack applications
- **agentic-iam** - Documentation-first Identity and Access foundation starter (manual-adoption)

## Standard Installation Locations

Runtime starter packs install into specific directories under `app/`:

| Starter Pack | Installation Path |
|---|---|
| agentic-clean-backend | `app/backend` |
| agentic-dotnet-backend | `app/backend` |
| agentic-react-spa | `app/web` |
| agentic-angular-spa | `app/web` |
| agentic-flutter-client | `app/client` |
| agentic-react-native | `app/client` |
| agentic-postgres-dev | `app/infra` |
| agentic-api-contracts-api | `app/contracts` |
| agentic-fullstack-composition | `app/composition` |

Foundation starter adoption model:

- `agentic-iam` -> manual copy or subtree-vendor (docs + governance artifacts)
- Foundation starters are not installed into a single canonical runtime `app/*` slot

## Available Starter Packs

### Clean Backend Starter

Provides a backend service built with Clean Architecture principles.

**Purpose**: RESTful API or backend service with domain-driven design

**Architecture Layers**:
- Domain: Business logic and entities
- Application: Use cases and application services
- Infrastructure: Data persistence, external integrations
- API: HTTP controllers and endpoints

**Installation**: `app/backend`

### Dotnet Backend Starter

Provides a backend service for .NET-based architectures.

**Purpose**: RESTful API or backend service implemented with .NET stack conventions

**Architecture**:
- Layered backend structure
- API-first integration through contracts
- Infrastructure integration points

**Installation**: `app/backend`

### React SPA Starter

Provides a React-based single-page application for web clients.

**Purpose**: Modern web client application

**Architecture**:
- Component-based architecture
- State management
- API integration via contracts
- Responsive design

**Configuration**: Uses `API_BASE_URL` for backend integration

**Installation**: `app/web`

### Angular SPA Starter

Provides an Angular-based single-page application for web clients.

**Purpose**: Modern web client application using Angular

**Architecture**:
- Component/module-based architecture
- API integration via contracts
- Responsive UI structure

**Configuration**: Uses `API_BASE_URL` for backend integration

**Installation**: `app/web`

### Flutter Client Starter

Provides a Flutter application for cross-platform client development.

**Purpose**: Cross-platform client supporting mobile (iOS/Android), web, and desktop

**Architecture Layers**:
```
lib/
  domain/          # Business entities and logic
  application/     # Use cases and services
  infrastructure/  # Data sources, API clients
  presentation/    # UI widgets and screens
```

**Integration**: Connects to backend via API contracts defined in `app/contracts`

**Configuration**: Uses `API_BASE_URL` environment variable for backend endpoint

**Installation**: `app/client`

### PostgreSQL Dev Starter

Provides database infrastructure setup for PostgreSQL.

**Purpose**: Local development database with migrations and seeding

**Installation**: `app/infra`

### API Contracts Starter

Provides OpenAPI specification for API contracts.

**Purpose**: Contract-first API design and client generation

**Installation**: `app/contracts`

### Fullstack Composition Starter

Provides orchestration for full-stack applications.

**Purpose**: Docker Compose and deployment configuration

**Installation**: `app/composition`

### IAM Foundation Starter

Provides a reusable, documentation-first Identity and Access domain foundation.

**Purpose**: Standardize IAM domain language, policies, ADR seeds, and starter consumption guidance before runtime implementation.

**Installation**: manual copy or subtree-vendor (docs + governance artifacts)

## How to Install a Starter Pack

Runtime starters are installed into canonical `app/*` targets.
Foundation starters are adopted manually via documentation/governance artifacts and do not require a runtime target path.

### Option 1: Git Subtree (Recommended)

Provides easy updates if the starter pack evolves.

```bash
# Add starter pack to its canonical subdirectory under app/
git subtree add --prefix <TARGET-PATH> <STARTER-PACK-URL> <BRANCH>

# Example (backend):
git subtree add --prefix app/backend https://github.com/your-org/agentic-clean-backend main
```

After installation:
1. Verify `app/` contains the starter pack contents.
2. Update `docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md` (see [ARCHITECTURE-ONBOARDING.md](./ARCHITECTURE-ONBOARDING.md)).
3. Commit the changes.

### Option 2: Copy/Paste

Simple manual approach for smaller projects.

```bash
# Download starter pack
git clone <STARTER-PACK-URL> temp-starter

# Copy contents to canonical target path
cp -r temp-starter/* <TARGET-PATH>/

# Clean up
rm -rf temp-starter

# Commit
git add <TARGET-PATH>
git commit -m "Install <STARTER-PACK-NAME>"
```

### Option 3: Script-Based Bootstrap

Some starter packs may provide a bootstrap script:

```bash
./scripts/bootstrap.sh --starter-pack <STARTER-NAME>
```

Consult the starter pack documentation for details.

Canonical starter targets:
- `agentic-clean-backend` -> `app/backend`
- `agentic-dotnet-backend` -> `app/backend`
- `agentic-react-spa` -> `app/web`
- `agentic-angular-spa` -> `app/web`
- `agentic-flutter-client` or `agentic-react-native` -> `app/client`
- `agentic-api-contracts-api` -> `app/contracts`
- `agentic-postgres-dev` -> `app/infra`
- `agentic-fullstack-composition` -> `app/composition`

Foundation starter targets:

- `agentic-iam` -> manual copy or subtree-vendor (docs + governance artifacts)

## Creating Your Own Starter Pack

To create a starter pack for your team:

1. **Create a new repository**: `starter-<STACK-NAME>`
2. **Populate with**:
   - Minimal working project structure
   - `README.md` with setup instructions
   - `docs/ADR-001-ARCHITECTURE-STRATEGY.md` (template)
   - `.gitignore` for your stack
   - Optional: `scripts/bootstrap.sh` for automation
3. **Document**:
   - Technology choices and versions
   - How to update it when dependencies upgrade
   - Known limitations or choices
4. **Test**: Install it using one of the three methods above on a test repository.
5. **Add to registry**: Update this file with the new starter pack link.

## Web and Client Architecture

The platform supports alternative web starter packs and a cross-platform client starter pack:

**React SPA** (`app/web`):
- Web-only client
- Runs in browsers
- Modern JavaScript/TypeScript ecosystem

**Angular SPA** (`app/web`):
- Web-only client
- Runs in browsers
- Angular ecosystem and tooling

**Flutter Client** (`app/client`):
- Cross-platform: mobile, web, desktop
- Single codebase for all platforms
- Dart language
- Clean Architecture layers

Both clients integrate with the backend via OpenAPI contracts in `app/contracts`.

## Example Starter Pack Structure

```
starter-dotnet/
├── README.md                          # Setup instructions
├── .gitignore                         # .NET-specific
├── src/
│   ├── Domain/                        # Business logic (framework-agnostic)
│   ├── Application/                   # Use cases
│   ├── Infrastructure/                # Database, external services
│   └── Api/                           # Controllers, HTTP layer
├── tests/
│   ├── Domain.Tests/
│   ├── Application.Tests/
│   └── Integration.Tests/
├── docs/
│   └── ADR-001-ARCHITECTURE-STRATEGY.md
└── scripts/
    └── bootstrap.sh                   # Optional setup helper
```

## Maintenance

**After installing a starter pack**:
- You own all code under `app/`.
- Updates to the starter pack are **your choice** (use `git subtree pull` if desired).
- Document any customizations in `docs/adr/`.

**Keep starter packs clean**:
- Starter packs must remain **generic** and **reusable**.
- Project-specific code should NOT be in the starter pack.
- If you create a variant, consider a new starter pack repository.

## Questions?

- Consult [ARCHITECTURE-ONBOARDING.md](./ARCHITECTURE-ONBOARDING.md) for setup guidance.
- Review [ARCHITECTURE-REQUIREMENTS.md](./ARCHITECTURE-REQUIREMENTS.md) for architectural standards.
- Create an issue if a starter pack is missing or needs improvement.
