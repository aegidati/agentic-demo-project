# AUDIT REPORT — Agentic React Native

## Starter identity

ID: agentic-react-native  
Type: frontend  
Version: 0.1.0

---

## Intended install path

app/client

---

## Purpose

Provide a mobile client foundation for React Native inside the Agentic platform ecosystem.

---

## Owned paths

app/client

---

## Expected contents

app/client

Contains:
- React Native project with Expo
- TypeScript configuration
- React Navigation setup
- Jest-based smoke test setup
- Basic app structure

---

## Dependencies

### Required

None.

### Optional

- agentic-api-contracts-api
- agentic-fullstack-composition
- agentic-clean-backend

---

## Runtime and services

Node.js ≥20  
React Native 0.72+  
Expo SDK 55+  
Jest for unit testing

---

## Installation

This starter is installed via:

```bash
git subtree add --prefix app/client https://github.com/aegidati/agentic-react-native.git main --squash
```

Or as part of project assembly workflow.

---

## Configuration

Standard configuration is in:

- app/app.json (Expo configuration)
- app/package.json (dependencies and scripts)
- app/tsconfig.json (TypeScript configuration)
- app/metro.config.js (bundler configuration)

---

## Testing

Tests are located in:

app/__tests__/

Run tests with:

```bash
npm test
```

---

## Development

Start development server with:

```bash
npm run dev
# or
npx expo start
```

---

## Build

Build the starter web bundle with:

```bash
npm run build
```

Current build implementation:

```bash
expo export --platform web
```
