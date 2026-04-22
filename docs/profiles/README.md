# Authentication Profile Recipes

This directory contains profile-specific authentication architecture recipes for all supported project profiles.

Each recipe describes the recommended authentication approach for a specific project profile without prescribing implementation code. Recipes are decision-oriented: they surface what must be chosen, what is recommended, and what ADR seeds apply specifically to that profile.

## Available Profiles

| Profile | File | Recommended Provider |
|---|---|---|
| web-stack | [web-stack.md](web-stack.md) | Entra ID via MSAL React |
| api-stack | [api-stack.md](api-stack.md) | Entra ID Service Principal |
| mobile-stack | [mobile-stack.md](mobile-stack.md) | Entra ID via MSAL Mobile |
| fullstack-stack | [fullstack-stack.md](fullstack-stack.md) | Unified Entra ID |
| web-stack-angular | [web-stack-angular.md](web-stack-angular.md) | Entra ID via MSAL Angular |
| api-stack-dotnet | [api-stack-dotnet.md](api-stack-dotnet.md) | Entra ID via Microsoft.Identity.Web |
| fullstack-angular-dotnet | [fullstack-angular-dotnet.md](fullstack-angular-dotnet.md) | Unified Entra ID |

## How To Use A Recipe

1. Confirm `project.profile` in PROJECT-BOOTSTRAP.yaml matches the recipe you are reading.
2. Read the recipe from top to bottom before writing any code.
3. Promote the profile-specific ADR seeds into project ADRs.
4. Convert the scaffolding hints into backlog implementation tasks.
5. Keep provider-specific configuration (client IDs, tenant IDs, scopes) in environment variables, never in source code.

## Common Invariant Across All Profiles

The token validation algorithm is identical across all profiles:

1. Extract IdentityToken from request (header, cookie, or body — location is profile-specific).
2. Verify token signature against AuthProvider public key.
3. Check token expiry, audience, and issuer.
4. Extract TokenClaims.subject.
5. Resolve User entity from subject.
6. Normalize any verified external role/group signals into a provider-agnostic form.
7. Delegate platform-role resolution to the IDENTITY-ACCESS domain.
8. Initiate tenant context resolution (IDENTITY-ACCESS domain).
9. Evaluate Permission for User-Tenant pair.

Only the token source and the refresh mechanism differ across profiles.

Guardrail: clients and authentication middleware must not make the final Superadmin decision locally. Platform-scope privileged resolution remains IAM-owned and aligned with [ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md](../adr/ADR-008-PLATFORM-SUPERADMIN-BOUNDARY.md).
