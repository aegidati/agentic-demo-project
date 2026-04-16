# Authentication Recipe — fullstack-angular-dotnet

Profile: fullstack-angular-dotnet
Stack: Angular SPA + .NET Backend + Flutter Client + PostgreSQL

## Overview

This recipe describes the recommended authentication architecture for projects using the fullstack-angular-dotnet profile. An Angular web client and a Flutter mobile client share a .NET backend. The unified AuthProvider is Azure Entra ID.

## Recommended AuthProvider

Unified Azure Entra ID.

- Angular client: MSAL Angular (`@azure/msal-angular`)
- React Native client: Auth0 via `react-native-auth0`
- .NET backend: `Microsoft.Identity.Web`

All shared the same .NET backend with unified authentication. Angular uses MSAL Angular with Entra ID, while React Native uses Auth0.

> **Note on provider alignment**: This profile uses two different AuthProviders for the two client types to leverage platform-best-practices. The Angular client integrates with MSAL Angular for enterprise Entra ID support, while the React Native client uses Auth0 for native mobile SDKs. Both routes produce standard JWT tokens validated idiomatically by the .NET backend. For a unified provider across all clients, consider using Auth0 for both (Angular and React Native) or standardizing on Entra ID where appropriate.

## Token Strategy

Dual token strategy for dual providers:

- Angular: Bearer token from MSAL Angular (Entra ID)
- React Native: Bearer token from `react-native-auth0` (Auth0)
- .NET backend: validates both token types via separate middleware chains or unified JWT validation

Angular: `MsalInterceptor` injects Entra ID bearer token automatically
- React Native: `react-native-auth0` manages Auth0 bearer token for HTTP requests
- .NET backend: `Microsoft.Identity.Web` validates Entra ID tokens; custom JWT middleware validates Auth0 tokens

## Session Model

- Angular: MSAL browser cache (sessionStorage or configured variant)
- React Native: `react-native-auth0`-managed secure storage (Keychain/Keystore)
- .NET backend: fully stateless

## Backend Validation Pattern

Declarative via `Microsoft.Identity.Web` — same as api-stack-dotnet:

```csharp
builder.Services.AddMicrosoftIdentityWebApiAuthentication(
    builder.Configuration, configSectionName: "AzureAd");
```

All controllers or minimal API endpoints requiring authentication apply `[Authorize]`. Tenant context middleware runs after authentication.

## Client Scaffolding Hints

Angular (web) — same as web-stack-angular:
```
app/web/src/
  app.config.ts               — MsalModule, MsalInterceptor, MsalGuard
  auth/msal.config.ts         — MSAL configuration
  auth/auth.service.ts        — login, logout, account state
```

React Native (mobile) — same as mobile-stack:
```
app/client/src/
  auth/
    auth0Config.ts
    authService.ts
    authState.ts
```

.NET backend — same as api-stack-dotnet:
```
app/backend/src/
  Presentation/Middleware/TenantContextMiddleware.cs
  Application/Auth/ICurrentUserService.cs
  Application/Auth/CurrentUserService.cs
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for fullstack-angular-dotnet:

1. **Dual Provider Strategy**: MSAL Angular (Entra ID) for web vs Auth0 for React Native. How should the backend route authentication logic? Separate middleware chains, unified validator, or policy-based dispatch?
2. **MSAL Angular Configuration**: SPA redirect URI for Entra ID. What audience for the access token acquired by Angular?
3. **Auth0 React Native Configuration**: What Auth0 API identifier and audience for React Native tokens?
4. **Cross-Client Token Validation**: .NET backend must validate both Entra ID JWTs and Auth0 JWTs. How to distinguish token source? By issuer claim, or separate validation endpoints?
5. **Cross-Client Logout Synchronization**: if User logs out on Angular, should React Native session also be invalidated? Requires coordination.
6. **Tenant Context Consistency**: can Angular client and React Native client be active in different tenants simultaneously? State the business rule.
7. **Configuration Management**: separate Entra ID and Auth0 credentials per environment. Use Key Vault for production.

## Integration With IDENTITY-ACCESS Domain

Angular and Flutter both produce the same bearer token format accepted by the .NET backend:

- `TokenClaims.subject` → `User.id` (extracted via `ICurrentUserService`)
- Tenant context resolved by `TenantContextMiddleware` using IDENTITY-ACCESS domain
- `TenantMembership.status === Active` enforced before any tenanted operation
- `Permission` evaluation performed in the Application layer, not in the controller
