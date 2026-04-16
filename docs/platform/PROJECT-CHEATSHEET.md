# Project Cheatsheet

Quick reference for the **most common prompts** used when working with projects created from the **agentic-project-template**.

This cheatsheet summarizes the daily workflow used by developers and AI agents.

---

# Copilot Execution Modes

Copilot prompts can run in two modes.

| Mode  | Purpose |
|------|------|
| ASK  | analysis, planning, validation |
| AGENT | modifying files, installing components, implementing code |

Rule:

ASK → reasoning  
AGENT → repository changes

---

# Project Bootstrap (Quick Reminder)

Use these prompts when starting a **new project from the template**.

| Step | Mode | Prompt |
|-----|-----|-----|
| 1 | ASK | Verify that the agentic project template structure is valid and ready for project initialization. |
| 2 | AGENT | Initialize the project bootstrap and create the project manifest. |
| 3 | AGENT | Install the required starter repositories for this project following the platform starter conventions. |
| 4 | ASK | Create ADR-001 describing the architecture strategy for this project. |
| 5 | ASK | Create or update the architecture snapshot for the current project structure. |
| 6 | ASK | Validate that the project structure, architecture and starters are correctly installed. |

After these steps the project is ready for development.

---

# Starter Selection Quick Rules

- Use `project.profile` as the recommended default starter selection mechanism.
- Use `starters:` only for explicit manual overrides.
- `starter-installer` resolves profile starters first, then applies manual overrides.
- Manual `starters`-only manifests remain valid for backward compatibility.

---

# Creating a New Feature

Prompt:

```
Create feature: <feature-name>
```

Example:

```
Create feature: user authentication
```

Result:

```
docs/features/<feature-slug>/
```

---

# Feature Lifecycle Structure

Every feature contains the following lifecycle artifacts.

```
docs/features/<feature-slug>/

00-REQUEST.md
01-PLAN.md
02-TEST-STRATEGY.md
03-IMPLEMENTATION-LOG.md
04-REVIEW.md
05-DONE.md
```

---

# Checking Feature Status

Prompt:

```
Evaluate lifecycle status of feature <feature-slug>
```

Purpose:

- detect current lifecycle stage
- identify missing artifacts
- suggest next valid step

---

# Validate Feature Planning

Prompt:

```
Review the PLAN and TEST STRATEGY for feature <feature-slug> and confirm readiness for implementation.
```

Purpose:

- validate architecture alignment
- validate test coverage
- confirm readiness for implementation

---

# Implementing a Feature

Mode: **AGENT**

Prompt:

```
Implement feature <feature-slug> according to the implementation log and project architecture.
```

Purpose:

- implement feature code
- update implementation log
- respect architecture rules

---

# Moving Feature to Review

Prompt:

```
Evaluate lifecycle status of feature <feature-slug> and confirm if it can move to REVIEW.
```

---

# Performing Feature Review

Prompt:

```
Perform a feature review for <feature-slug> following the project governance rules.
```

Purpose:

- validate architecture compliance
- validate tests
- validate documentation

---

# Validating Definition of Done

Prompt:

```
Evaluate lifecycle status of feature <feature-slug> and confirm if it satisfies Definition of Done.
```

---

# Finalizing a Feature

Mode: **AGENT**

Prompt:

```
Finalize feature <feature-slug> and update DONE documentation.
```

Purpose:

- close lifecycle
- confirm delivery
- update documentation

---

# Most Frequently Used Prompts

These prompts are used daily.

```
Create feature: <feature-name>

Evaluate lifecycle status of feature <feature-slug>

Implement feature <feature-slug>

Perform a feature review for <feature-slug>
```

---

# Naming Rules

Feature names must follow **kebab-case**.

Examples:

```
user-authentication
payment-processing
product-catalog
order-management
```

---

# Lifecycle Rules

1. Implementation cannot start without:
   - PLAN
   - TEST STRATEGY

2. REVIEW requires completed implementation.

3. DONE requires:
   - approved review
   - Definition of Done validation.

---

# Workflow Overview

```
Create feature
↓
Evaluate lifecycle
↓
Validate plan and test strategy
↓
Implement feature
↓
Evaluate lifecycle
↓
Review feature
↓
Validate Definition of Done
↓
Finalize feature
```

---

# Purpose of This Cheatsheet

This document provides a **fast operational guide** for developers working with the template.

It ensures that all projects:

- follow a consistent development workflow
- maintain architecture governance
- keep documentation and code aligned