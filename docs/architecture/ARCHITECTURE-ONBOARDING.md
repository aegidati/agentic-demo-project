# Architecture Onboarding

## For Derived Projects

This template repository is **stack-agnostic**. To build a functional application, you must **adopt an architecture** via a **starter pack**.

## When to Choose an Architecture

**Timing**: Before implementing any real features, follow these steps:

### Step 1: Evaluate Starter Packs
- Review available starter packs: [STARTER-PACKS.md](./STARTER-PACKS.md)
- Each starter pack defines:
  - Technology stack (language, frameworks, databases)
  - Initial folder structure under `app/`
  - Minimal working example (health check, hello world)
  - Suggested Architecture Decision Record (ADR-001)

### Step 2: Install Starter Pack
Run the installation method specified in the starter pack:
- **Copy/paste**: Manual directory copy
- **Git subtree** (recommended): `git subtree add --prefix <TARGET-PATH> <STARTER-REPO> main`
- **Script-based**: Follow starter pack bootstrap script

Canonical starter targets:
- `agentic-clean-backend` -> `app/backend`
- `agentic-react-spa` -> `app/web`
- `agentic-flutter-client` -> `app/client`
- `agentic-api-contracts-api` -> `app/contracts`
- `agentic-postgres-dev` -> `app/infra`
- `agentic-fullstack-composition` -> `app/composition`

Example (git subtree, backend):
```bash
git subtree add --prefix app/backend https://github.com/your-org/agentic-clean-backend main
```

### Step 3: Create Project-Specific ADR-001
**File**: `docs/adr/ADR-001-ARCHITECTURE-STRATEGY.md`

Document:
- Which starter pack you chose and why
- Project-specific constraints (performance, compliance, team skills)
- Deviations from the starter pack template
- Any additional architectural decisions

### Step 4: Update ARCHITECTURE-SNAPSHOT.md
- Describe your chosen architecture at a high level
- Link to project-specific ADRs
- Use the template in [ARCHITECTURE-SNAPSHOT.md](./ARCHITECTURE-SNAPSHOT.md)

### Step 5: Begin Feature Development
- You may now use [AGENTIC-WORKFLOW.md](../governance/AGENTIC-WORKFLOW.md) to plan and implement features.
- All features must respect ADRs in `docs/adr/`.

## What NOT to Do

❌ **Do not** create application code directly in this template.  
❌ **Do not** skip architecture selection and go straight to features.  
❌ **Do not** modify the governance structure (docs/governance/, docs/adr/) without an ADR.  

## Support

- Questions about process? See [AGENTIC-WORKFLOW.md](../governance/AGENTIC-WORKFLOW.md)
- Questions about design? See [ARCHITECTURE-REQUIREMENTS.md](./ARCHITECTURE-REQUIREMENTS.md)
- Need to propose a new starter pack? Create an issue or ADR discussion.
