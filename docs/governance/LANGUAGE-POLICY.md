# Language Policy

## Overview
This project uses **multiple languages strategically** to balance clarity, accessibility, and domain communication.

## Language Rules

| Context | Language | Notes |
|---------|----------|-------|
| **Technical documentation** (docs/) | English | All technical docs must be copy-ready English. |
| **Code (classes, functions, variables)** | English | Consistent naming across all files. |
| **Comments in code** | English | Keep codebase universally readable. |
| **Commit messages** | English | Maintain git history in English for searchability. |
| **Brainstorming / Design discussions** | Italian (optional) | Internal discussions may use Italian for ideation. Convert to English in formal docs. |
| **Domain terminology** | English | Use domain-standard terms (e.g., "Customer," not "Cliente"). |

## Why This Policy?

- **Global collaboration**: English ensures team scalability.
- **Long-term maintainability**: Future contributors need English docs.
- **Standardization**: Agnostic architecture requires universal naming.
- **Italian option for ideation**: Allows faster initial brainstorming.

## Enforcement

- **Code reviews**: Check for non-English class/function names.
- **PR checks**: Documentation guardian agent verifies English in docs/.
- **Onboarding**: New contributors must follow this policy from day one.

## Exceptions

- **Domain models with legal names**: Keep legal entity names as-is (e.g., "Azienda X").
- **User-facing content**: May translate to language of end user (document separately in i18n/).
- **Historical names**: If renaming causes significant refactoring, document in ADR.
