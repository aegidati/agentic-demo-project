# Agentic React Native

## Purpose

This starter provides the mobile client foundation for Agentic platform projects.

It implements a React Native application using Expo for deterministic iOS/Android/Web development while remaining modular and independent from backend and runtime composition details.

The goal is to provide a reusable mobile client baseline that can evolve independently from backend, contracts, and runtime composition.

---

## Install target

This starter installs into:

app/client

---

## Included

- React Native project setup (Expo)
- TypeScript configuration
- React Navigation for routing
- Jest-based smoke test setup
- Mobile app structure for UI development
- Basic screen and component organization

---

## Not included

This starter intentionally does not include:

- Business-specific screens
- Authentication flows
- API client integration implementation details
- Observability tooling
- App store/Play store deployment configuration

Those concerns are handled by other starters or feature modules.

---

## Prerequisites

Typical runtime prerequisites:

- Node.js ≥20
- npm / pnpm / yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Physical device (optional, via Expo app)
- Optional Docker runtime for integration scenarios

---

## Development

Start the Expo development server with:

```bash
npm run dev
```

---

## Validation

Run the starter quality checks from `app/`:

```bash
npm install
npm run type-check
npm run lint
npm test -- --runInBand
npm run build
```

The build command exports the web bundle using Expo:

```bash
expo export --platform web
```
