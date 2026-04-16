# Project Bootstrap (Minimal Workflow)

This document defines the **minimum prompt sequence required to bootstrap a new project** created from the **agentic-project-template**.

The following prompts initialize:

- project bootstrap
- starter repositories
- architecture strategy
- architecture snapshot
- project validation

All prompts must be executed **in order**.

---

# Copilot Execution Modes

Copilot supports two execution modes.

| Mode  | Purpose                              |
|-------|--------------------------------------|
| ASK   | analysis, planning, validation       |
| AGENT | repository modifications             |

Rule:

ASK = reasoning  
AGENT = repository changes

---

# Bootstrap Prompt Sequence

| Step | Mode  | Prompt                                                                 | Purpose                                                         |
|-----:|-------|------------------------------------------------------------------------|-----------------------------------------------------------------|
| 1    | ASK   | Verify that the agentic project template structure is valid and ready for project initialization. | Ensures the template structure and governance are correct.     |
| 2    | AGENT | Initialize the project bootstrap and create the project manifest.     | Creates the project bootstrap configuration.                   |
| 3    | AGENT | Install the required starter repositories for this project following the platform starter conventions. | Installs starter repositories.                                 |
| 3b (optional) | AGENT | Adopt agentic-iam as a foundation starter via manual copy or subtree-vendor (docs + governance artifacts only). Do not install into runtime app/* paths. | Optional IAM foundation adoption. |
| 4    | ASK   | Create ADR-001 describing the architecture strategy for this project. | Defines the architecture strategy.                             |
| 5    | ASK   | Create or update the architecture snapshot for the current project structure. | Creates the architecture snapshot.                             |
| 6    | ASK   | Validate that the project structure, architecture and starters are correctly installed. | Confirms the project is ready for development.                 |

---

# Starter Selection Model

Starter selection is profile-first.

- Set `project.profile` in `PROJECT-BOOTSTRAP.yaml` as the default mechanism.
- Use `starters:` only for explicit manual overrides.
- The `starter-installer` resolves profile starters first, then applies manual overrides.
- Projects that use only `starters:` remain valid for backward compatibility.

See `docs/platform/STARTER-PROFILES.md` for profile definitions and resolution rules.

---

# Expected Result

After executing the bootstrap prompts the project should contain the following artifacts.

Architecture documents:

```
docs/adr/ADR-001-architecture-strategy.md
docs/architecture/ARCHITECTURE-SNAPSHOT.md
PROJECT-BOOTSTRAP.yaml
```

Starter repositories installed in:

```
app/backend
app/web
app/client
app/contracts
app/infra
app/composition
```

Optional foundation artifacts may also be adopted under docs/ and governance areas.
No foundation starter should repurpose runtime canonical app/* paths.

The project is now **ready for feature development**.

---

# Next Step

Create the first feature using the lifecycle workflow.

Prompt:

```
Create feature: <feature-name>
```

Example:

```
Create feature: user authentication
```

Then continue the feature lifecycle using the project governance rules.

---

# Goal of the Bootstrap Workflow

This workflow ensures that every project created from the template:

- has an explicit architecture strategy
- installs the correct application starters
- maintains consistent project governance
- is immediately ready for structured feature development

The template therefore acts as a **governed development platform**, not only a repository scaffold.