# Prompt 01 - Create Project Bootstrap

## Context
Create the project bootstrap manifest from template defaults.

If the project profile has not been explicitly chosen yet, determine it before creating the manifest.

## Prompt To Run In Copilot Chat
@starter-installer Create PROJECT-BOOTSTRAP.yaml from PROJECT-BOOTSTRAP.example.yaml.

Keep schema and keys unchanged.

Before creating the file:
- if the user has already specified the intended project profile, use it directly
- otherwise, ask the user to choose one profile from the allowed options below
- briefly describe each option so the choice is unambiguous
- do not assume a default profile when `project.profile` is still null in the template

Allowed profile options:
- `web-stack` — browser-first web application with backend, shared API contracts, and development infrastructure
- `mobile-stack` — mobile-first application with Flutter client, backend, shared API contracts, and development infrastructure
- `mobile-stack-react-native` — mobile-first application with React Native client, backend, shared API contracts, and development infrastructure
- `api-stack` — headless backend/API project with contracts and development infrastructure
- `fullstack-stack` — multi-client product with backend, React SPA, Flutter client, contracts, infrastructure, and composition layer
- `fullstack-stack-react-native` — multi-client product with backend, React SPA, React Native client, contracts, infrastructure, and composition layer
- `web-stack-angular` — browser-first web application with Angular SPA, .NET backend, shared API contracts, and development infrastructure
- `api-stack-dotnet` — headless .NET backend/API project with contracts and development infrastructure
- `fullstack-angular-dotnet` — multi-client product with .NET backend, Angular SPA, Flutter client, contracts, infrastructure, and composition layer
- `fullstack-angular-dotnet-react-native` — multi-client product with .NET backend, Angular SPA, React Native client, contracts, infrastructure, and composition layer
- `flutter-standalone` — standalone Flutter client application with no backend runtime starters
- `react-native-standalone` — standalone React Native client application with no backend runtime starters

When creating PROJECT-BOOTSTRAP.yaml:
- use `project.profile` as the recommended default starter selection mechanism
- use `starters:` only for explicit manual overrides
- keep unselected manual overrides as `repo: null`
- do not add business-specific fields
- do not change starter paths
- preserve template compatibility and profile-first starter resolution

## Done Criteria
1. PROJECT-BOOTSTRAP.yaml exists at repository root.
2. Manifest schema matches the template format exactly.
3. `project.profile` is explicitly chosen when using profile-first bootstrap.
4. If the profile was not already provided, the user is asked to choose from the allowed profile list before file creation.
5. `starters:` is used only for explicit overrides, and unselected overrides remain `repo: null`.
6. No business-specific or schema-breaking fields are introduced.