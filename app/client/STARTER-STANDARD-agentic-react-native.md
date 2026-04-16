# Agentic Starter Standard
Starter: agentic-react-native
Version: 0.1.0

This document contains the full starter repository contract.

The following files must exist in the repository:

agentic-react-native/
  app/
  README.md
  AUDIT-REPORT.md
  starter.manifest.yaml
  starter.json
  .github/workflows/ci.yml

---

## app/ directory structure

The `app/` directory contains the React Native application.

Required files:

```
app/
  App.tsx               (Expo entry point)
  package.json          (npm dependencies and scripts)
  tsconfig.json         (TypeScript configuration)
  metro.config.js       (Metro bundler configuration)
  app.json              (Expo configuration)
  .env.example          (Environment variables template)
  src/
    App.tsx             (Root application component)
    screens/            (Screen components)
    components/         (Reusable components)
    navigation/         (Navigation setup)
    styles/             (Shared styles)
  __tests__/            (Test files)
    App.test.tsx        (Root component test)
```

### package.json

Must include:

- `react` ≥18.2.0
- `react-native` ≥0.72.0
- `expo` ≥55.0.0
- `@react-navigation/native` and `@react-navigation/native-stack`
- `typescript` compatible with current eslint toolchain
- `jest` for smoke tests
- Scripts: `dev`, `build`, `lint`, `type-check`, `test`

### app.json

Must include Expo configuration:
- `name`: "Agentic"
- `slug`: "agentic-mobile"
- `version`: "0.1.0"
- `platforms`: ["ios", "android", "web"]

### tsconfig.json

Must have:
- Target: ES2020 or later
- JSX: react-native
- Strict mode enabled
- Module resolution configured

### metro.config.js

Must be valid Metro bundler configuration for React Native/Expo.

---

## README.md

Must document:

- Purpose of the starter
- Install target path (app/client)
- What is included
- What is intentionally NOT included
- Required prerequisites
- Installation and development instructions

---

## AUDIT-REPORT.md

Must document:

- Starter identity (id, type, version)
- Intended install path
- Purpose
- Owned paths
- Dependencies (required and optional)
- Runtime requirements
- Configuration files
- Testing location
- Development and build commands

---

## starter.manifest.yaml

Must define:

- `id`: agentic-react-native
- `name`: Agentic React Native
- `type`: frontend
- `installsInto`: app/client
- `ownedPaths`: [app/client]
- `requires`: node-runtime, frontend-package-manager, expo-cli
- `postInstallChecks`: validation commands
- `tags`: appropriate tags for discovery

---

## starter.json

Must provide:

- `name`: react-native
- `version`: 0.1.0
- `entry`: app
- `stack`: runtime, platform, language, framework, router, test details

---

## .github/workflows/ci.yml

CI/CD pipeline must:

- Install dependencies
- Run lint checks
- Run TypeScript type checking
- Run unit tests
- Validate build command
- Run on push to main and pull requests

Must run from the `app/` directory.

---

## Post-Install Validation

After installation, verify:

1. Dependencies install: `cd app && npm install`
2. Lint passes: `npm run lint`
3. Type check passes: `npm run type-check`
4. Tests pass: `npm test`
5. Dev server starts: `npm run dev`
6. Build completes: `npm run build`

All commands must run from the `app/` directory.

The current build command is `expo export --platform web`.
