# Add Starter Profiles to the Template

This prompt is intended for **GitHub Copilot Chat**.

Use it inside the repository **`agentic-project-template`** to introduce **starter profiles** as the default mechanism for selecting starter repositories during project bootstrap.

Run Copilot in **Plan → Agent** mode.

---

# Prompt

You are working inside the repository `agentic-project-template`.

Your task is to extend the platform bootstrap model by introducing **starter profiles** as the default mechanism for starter selection.

The goal is to make project initialization simpler, more standardized, and less error-prone.

Follow the repository conventions already present in this template.

Do not add application code.  
Do not break backward compatibility.  
Do not remove the existing manual `starters` mechanism.  
Keep the repository framework-agnostic.

---

# Objective

Implement starter profiles so that new projects can define:

- a single `project.profile`
- optional manual overrides in `starters`

The bootstrap system must support both.

---

# Required Outcome

Update the template so that:

1. `PROJECT-BOOTSTRAP.example.yaml` supports:
   - `project.profile`
   - `profiles`
   - `starters` as explicit override
   - starter resolution rules
   - installation order rules

2. Add documentation file:

```
docs/platform/STARTER-PROFILES.md
```

3. Update existing platform/bootstrap documentation so that the new profile-based workflow is official and discoverable.

4. Preserve this rule:

- if `project.profile` is set, starters are resolved from the profile
- if `starters.<name>.repo` is explicitly set, it overrides the profile
- if both are empty, bootstrap is not ready

---

# Phase 1 — Analyze Current Template Conventions

Inspect the repository and identify:

- current structure of `PROJECT-BOOTSTRAP.example.yaml`
- existing bootstrap documentation
- existing starter installation documentation
- references to starter selection
- prompts related to project bootstrap
- compatibility matrices or starter ecosystem documentation

Before making changes, produce a short **implementation plan** aligned with the current repository structure.

---

# Phase 2 — Update PROJECT-BOOTSTRAP.example.yaml

Extend `PROJECT-BOOTSTRAP.example.yaml` to support starter profiles.

The file must include:

- `project.name`
- `project.template_version`
- `project.profile`
- `profiles`
- `starters`
- `rules.starter_resolution`
- `rules.installation_order`
- `architecture`
- `agents.enabled`

---

## Starter Profiles

Implement these profiles.

### web-stack

- backend → `agentic-clean-backend` → `app/backend`
- web → `agentic-react-spa` → `app/web`
- client → null → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → null → `app/composition`

---

### mobile-stack

- backend → `agentic-clean-backend` → `app/backend`
- web → null → `app/web`
- client → `agentic-flutter-client` → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → null → `app/composition`

---

### mobile-stack-react-native

- backend → `agentic-clean-backend` → `app/backend`
- web → null → `app/web`
- client → `agentic-react-native` → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → null → `app/composition`

---

### api-stack

- backend → `agentic-clean-backend` → `app/backend`
- web → null → `app/web`
- client → null → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → null → `app/composition`

---

### fullstack-stack

- backend → `agentic-clean-backend` → `app/backend`
- web → `agentic-react-spa` → `app/web`
- client → `agentic-flutter-client` → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → `agentic-fullstack-composition` → `app/composition`

---

### fullstack-stack-react-native

- backend → `agentic-clean-backend` → `app/backend`
- web → `agentic-react-spa` → `app/web`
- client → `agentic-react-native` → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → `agentic-fullstack-composition` → `app/composition`

---

### web-stack-angular

- backend → `agentic-dotnet-backend` → `app/backend`
- web → `agentic-angular-spa` → `app/web`
- client → null → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → null → `app/composition`

---

### api-stack-dotnet

- backend → `agentic-dotnet-backend` → `app/backend`
- web → null → `app/web`
- client → null → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → null → `app/composition`

---

### fullstack-angular-dotnet

- backend → `agentic-dotnet-backend` → `app/backend`
- web → `agentic-angular-spa` → `app/web`
- client → `agentic-flutter-client` → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → `agentic-fullstack-composition` → `app/composition`

---

### fullstack-angular-dotnet-react-native

- backend → `agentic-dotnet-backend` → `app/backend`
- web → `agentic-angular-spa` → `app/web`
- client → `agentic-react-native` → `app/client`
- contracts → `agentic-api-contracts-api` → `app/contracts`
- infra → `agentic-postgres-dev` → `app/infra`
- composition → `agentic-fullstack-composition` → `app/composition`

---

### flutter-standalone

- backend → null → `app/backend`
- web → null → `app/web`
- client → `agentic-flutter-client` → `app/client`
- contracts → null → `app/contracts`
- infra → null → `app/infra`
- composition → null → `app/composition`

---

### react-native-standalone

- backend → null → `app/backend`
- web → null → `app/web`
- client → `agentic-react-native` → `app/client`
- contracts → null → `app/contracts`
- infra → null → `app/infra`
- composition → null → `app/composition`

---

Backend and web are alternative starters per slot canonico while keeping canonical install paths unchanged.

---

## Manual Starter Override

The YAML must keep a manual `starters:` section.

Default:

```
repo: null
```

Manual values override profile values.

---

# Starter Resolution Rules

Add these rules:

- If `project.profile` is set, resolve starters from `profiles.<profile>.starters`
- If `starters.*.repo` is explicitly set, it overrides the profile value
- If both profile and manual starters are empty, bootstrap is not ready
- Only starters with `repo != null` should be installed

---

# Installation Order

Define canonical installation order:

1. contracts  
2. backend  
3. web  
4. client  
5. infra  
6. composition

---

# Phase 3 — Create Documentation

Create the file:

```
docs/platform/STARTER-PROFILES.md
```

This document must include:

- purpose of starter profiles
- starter resolution rules
- table of available profiles
- detailed descriptions of each profile
- how to choose a profile
- manual override example
- operational rules for the `starter-installer` agent

Ensure the documentation tone matches existing platform documentation.

---

# Phase 4 — Update Platform Documentation

Inspect the repository and update relevant documents so that the **profile-based workflow becomes official**.

Possible candidates:

- `docs/platform/PROJECT-BOOTSTRAP.md`
- `docs/platform/PROJECT-WORKFLOW.md`
- `docs/platform/PROJECT-CHEATSHEET.md`
- `docs/platform/STARTER-ECOSYSTEM.md`
- `docs/architecture/STARTER-PACKS.md`
- prompt files in `docs/platform/prompts/`

Keep modifications minimal and consistent with existing conventions.

Documentation must clearly explain:

- how to use `project.profile`
- that starter profiles are the recommended mechanism
- that `starters:` acts as an override
- that `starter-installer` resolves profiles first

---

# Phase 5 — Preserve Backward Compatibility

Do not remove the existing starter configuration model.

Ensure:

- projects using only `starters:` remain valid
- profile-based projects also work
- documentation explains both approaches

Profiles should be the **recommended default**, but not mandatory.

---

# Phase 6 — Quality Checks

Before completing the task verify:

- YAML syntax is valid
- Markdown formatting is valid
- no application code was introduced
- documentation remains framework-agnostic
- profile names are used consistently
- starter paths are canonical
- repository structure remains suitable as a reusable template

---

# Final Output

Provide a short summary including:

1. files created
2. files updated
3. starter profiles introduced
4. bootstrap rules implemented
5. any inconsistencies found but intentionally preserved