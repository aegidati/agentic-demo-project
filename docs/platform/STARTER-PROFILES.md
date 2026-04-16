# Starter Profiles

This document defines the **official starter profiles** available in the `agentic-project-template`.

Starter profiles are used to simplify project bootstrap by grouping compatible starter repositories into standard platform configurations.

Instead of manually choosing every starter for each new project, you can select a single profile in:

`PROJECT-BOOTSTRAP.yaml`

Example:

```yaml
project:
  name: my-project
  template_version: "1.0"
  profile: web-stack
```

---

# Purpose

Starter profiles provide a deterministic, low-error default for project assembly.

They help teams:

- select a standard architecture with one value (`project.profile`)
- keep starter selection framework-agnostic
- preserve backward compatibility with manual starter selection

Profiles are the **recommended default**. Manual starter selection remains supported.

---

# Starter Resolution Rules

Starter resolution is defined in `PROJECT-BOOTSTRAP.yaml` under `rules.starter_resolution`.

Resolution order:

1. If `project.profile` is set, resolve starters from `profiles.<profile>.starters`.
2. If `starters.<name>.repo` is explicitly set, it overrides the resolved profile value for that starter.
3. If both profile and manual starters are empty, bootstrap is not ready.
4. Only starters with `repo != null` are installed.

Installation order:

1. contracts
2. backend
3. web
4. client
5. infra
6. composition

---

# Available Profiles

| Profile | Intended Use | Enabled Starters |
|---|---|---|
| `web-stack` | Browser-first web application | contracts, backend, web, infra |
| `mobile-stack` | Mobile-first application | contracts, backend, client, infra |
| `mobile-stack-react-native` | Mobile-first application (React Native client) | contracts, backend, client, infra |
| `api-stack` | Headless API/backend service | contracts, backend, infra |
| `fullstack-stack` | Multi-client fullstack system | contracts, backend, web, client, infra, composition |
| `fullstack-stack-react-native` | Multi-client fullstack system (React + React Native) | contracts, backend, web, client, infra, composition |
| `web-stack-angular` | Browser-first web application (Angular + .NET backend) | contracts, backend, web, infra |
| `api-stack-dotnet` | Headless API/backend service (.NET backend) | contracts, backend, infra |
| `fullstack-angular-dotnet` | Multi-client fullstack system (Angular + .NET backend) | contracts, backend, web, client, infra, composition |
| `fullstack-angular-dotnet-react-native` | Multi-client fullstack system (Angular + .NET + React Native) | contracts, backend, web, client, infra, composition |
| `flutter-standalone` | Standalone Flutter client application | client |
| `react-native-standalone` | Standalone React Native client application | client |

---

# Profile Details

## web-stack

Use when the primary client is a browser SPA.

- backend -> `agentic-clean-backend` -> `app/backend`
- web -> `agentic-react-spa` -> `app/web`
- client -> `null` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `null` -> `app/composition`

## mobile-stack

Use when the primary client is Flutter/mobile.

- backend -> `agentic-clean-backend` -> `app/backend`
- web -> `null` -> `app/web`
- client -> `agentic-flutter-client` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `null` -> `app/composition`

## mobile-stack-react-native

Use when the primary client is React Native/mobile.

- backend -> `agentic-clean-backend` -> `app/backend`
- web -> `null` -> `app/web`
- client -> `agentic-react-native` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `null` -> `app/composition`

## api-stack

Use when no default UI starter is needed.

- backend -> `agentic-clean-backend` -> `app/backend`
- web -> `null` -> `app/web`
- client -> `null` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `null` -> `app/composition`

## fullstack-stack

Use when both web and mobile clients are required with composition support.

- backend -> `agentic-clean-backend` -> `app/backend`
- web -> `agentic-react-spa` -> `app/web`
- client -> `agentic-flutter-client` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `agentic-fullstack-composition` -> `app/composition`

## fullstack-stack-react-native

Use when both web and React Native clients are required with composition support.

- backend -> `agentic-clean-backend` -> `app/backend`
- web -> `agentic-react-spa` -> `app/web`
- client -> `agentic-react-native` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `agentic-fullstack-composition` -> `app/composition`

## web-stack-angular

Use when the primary client is an Angular browser SPA with .NET backend.

- backend -> `agentic-dotnet-backend` -> `app/backend`
- web -> `agentic-angular-spa` -> `app/web`
- client -> `null` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `null` -> `app/composition`

## api-stack-dotnet

Use when no default UI starter is needed and backend is .NET.

- backend -> `agentic-dotnet-backend` -> `app/backend`
- web -> `null` -> `app/web`
- client -> `null` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `null` -> `app/composition`

## fullstack-angular-dotnet

Use when both web and mobile clients are required with Angular + .NET backend and composition support.

- backend -> `agentic-dotnet-backend` -> `app/backend`
- web -> `agentic-angular-spa` -> `app/web`
- client -> `agentic-flutter-client` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `agentic-fullstack-composition` -> `app/composition`

## fullstack-angular-dotnet-react-native

Use when both web and React Native clients are required with Angular + .NET backend and composition support.

- backend -> `agentic-dotnet-backend` -> `app/backend`
- web -> `agentic-angular-spa` -> `app/web`
- client -> `agentic-react-native` -> `app/client`
- contracts -> `agentic-api-contracts-api` -> `app/contracts`
- infra -> `agentic-postgres-dev` -> `app/infra`
- composition -> `agentic-fullstack-composition` -> `app/composition`

## flutter-standalone

Use when only a standalone Flutter client is required and no backend runtime starters are needed.

- backend -> `null` -> `app/backend`
- web -> `null` -> `app/web`
- client -> `agentic-flutter-client` -> `app/client`
- contracts -> `null` -> `app/contracts`
- infra -> `null` -> `app/infra`
- composition -> `null` -> `app/composition`

## react-native-standalone

Use when only a standalone React Native client is required and no backend runtime starters are needed.

- backend -> `null` -> `app/backend`
- web -> `null` -> `app/web`
- client -> `agentic-react-native` -> `app/client`
- contracts -> `null` -> `app/contracts`
- infra -> `null` -> `app/infra`
- composition -> `null` -> `app/composition`

---

# How To Choose A Profile

Use this quick rule:

- Choose `web-stack` for web-first delivery.
- Choose `mobile-stack` for mobile-first delivery.
- Choose `mobile-stack-react-native` for React Native mobile-first delivery.
- Choose `api-stack` for service/API-only projects.
- Choose `fullstack-stack` when multiple clients and local composition are needed.
- Choose `fullstack-stack-react-native` when you need React web plus React Native with local composition.
- Choose `web-stack-angular` for Angular web-first delivery.
- Choose `api-stack-dotnet` for .NET service/API-only projects.
- Choose `fullstack-angular-dotnet` when Angular web + .NET backend are required with local composition.
- Choose `fullstack-angular-dotnet-react-native` when Angular web + .NET backend + React Native are required with local composition.
- Choose `flutter-standalone` for a standalone Flutter client with no backend runtime starters.
- Choose `react-native-standalone` for a standalone React Native client with no backend runtime starters.

If uncertain, start with `web-stack` and apply explicit overrides only when needed.

---

# Manual Override Example

Profiles are default. `starters` is an explicit override layer.

```yaml
project:
  name: my-project
  template_version: "1.0"
  profile: web-stack

starters:
  web:
    repo: null
    path: app/web
  client:
    repo: agentic-flutter-client
    path: app/client
```

In this example:

- base selection comes from `web-stack`
- `web` is disabled explicitly
- `client` is enabled explicitly

---

# Operational Rule For starter-installer

The `starter-installer` agent must resolve starters in this exact order:

1. Read `project.profile` and resolve `profiles.<profile>.starters`.
2. Apply explicit overrides from `starters.*.repo`.
3. Install only entries where `repo != null`.
4. Install in canonical order and canonical paths.

This preserves deterministic installation while keeping manual control available.

Backend and web are alternative starters per slot canonico while keeping canonical install paths unchanged.