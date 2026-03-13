# Documentation Source of Truth

This document defines precedence between documentation layers.

When documents conflict, the following precedence applies:

1. docs/governance/*
2. docs/adr/*
3. docs/architecture/ARCHITECTURE-SNAPSHOT.md
4. docs/platform/*
5. docs/routing/*
6. docs/ux/*
7. README.md

Rules:

Governance rules override architecture documentation.
ADR decisions override historical architecture documentation.
Architecture snapshot represents the current architecture state.
Routing documents define AI agent responsibilities.

All contributors and AI agents must respect this hierarchy.
