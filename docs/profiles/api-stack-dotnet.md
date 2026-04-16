# Authentication Recipe — api-stack-dotnet

Profile: api-stack-dotnet
Stack: .NET Backend + PostgreSQL (no frontend)

## Overview

This recipe describes the recommended authentication architecture for projects using the api-stack-dotnet profile. The backend is a .NET application (ASP.NET Core). There is no browser-based frontend. Authentication uses Microsoft.Identity.Web, the official .NET library for Entra ID integration.

## Recommended AuthProvider

Azure Entra ID via `Microsoft.Identity.Web`.

Rationale: `Microsoft.Identity.Web` is the official Microsoft-recommended library for securing ASP.NET Core APIs with Entra ID. It handles JWKS discovery, signature validation, and claims extraction with minimal configuration.

> **Note on provider portability**: Microsoft.Identity.Web is the recommended
> library when the project uses Azure Entra ID as AuthProvider. If Auth0 is
> chosen as the AuthProvider, replace Microsoft.Identity.Web with standard
> ASP.NET Core JWT Bearer middleware (`Microsoft.AspNetCore.Authentication.JwtBearer`)
> configured with the Auth0 JWKS endpoint and audience. The backend validation
> pattern remains identical.

## Token Strategy

**IdentityToken (Access Token)**:
- Format: JWT signed by Entra ID
- Lifetime: short (configurable, default ~1 hour)
- Audience: backend API application registration URI
- Carried in: `Authorization: Bearer <token>` header

**RefreshCredential**: not used by the API backend itself. Callers manage their own token acquisition and caching.

## Session Model

- No AuthSession on the backend: fully stateless.
- Each request is validated independently.
- The built-in `Microsoft.Identity.Web` middleware handles this automatically.

## Token Acquisition By Callers

Same as api-stack: callers use Client Credentials grant with their own Entra ID registration and cache tokens until near expiry.

## Backend Validation Pattern

With `Microsoft.Identity.Web`, validation is declarative:

```csharp
// Program.cs or Startup.cs
builder.Services.AddMicrosoftIdentityWebApiAuthentication(
    builder.Configuration, configSectionName: "AzureAd");

builder.Services.AddAuthorization();
```

```csharp
// appsettings.json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<tenant-id-from-env>",
    "ClientId": "<client-id-from-env>",
    "Audience": "api://<client-id>"
  }
}
```

```csharp
// Controller
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResourceController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        // User identity available via User.FindFirst(ClaimTypes.NameIdentifier)
        // Resolve User entity, then evaluate Permission per IDENTITY-ACCESS domain
        return Ok();
    }
}
```

All secrets and IDs must be loaded from environment variables or Key Vault, never hardcoded in `appsettings.json`.

## Backend Scaffolding Hints

```
app/backend/
  appsettings.json               — AzureAd section with placeholder values only
  src/
    Presentation/
      Middleware/
        TenantContextMiddleware.cs  — resolves tenant context after Authorize
    Application/
      Auth/
        ICurrentUserService.cs      — interface to access validated User claims
        CurrentUserService.cs       — implementation reading from HttpContext.User
    Domain/
      (User, TenantMembership, Permission — from IDENTITY-ACCESS domain)
```

## ADR Seeds Specific To This Profile

In addition to the shared ADR seeds in AUTHENTICATION/ADR-SEEDS.md, resolve these for api-stack-dotnet:

1. **App Roles vs Scopes**: use App Roles embedded in token claims for coarse-grained access, or OAuth2 scopes? Document in ADR.
2. **Configuration Source**: `appsettings.json` + User Secrets for development, Key Vault for production. Confirm Key Vault integration approach.
3. **Custom Claims Mapping**: does the project need to map Entra ID claims to domain-specific claims (e.g. map `oid` to User entity ID)?
4. **Multi-Tenant API**: single-tenant registration or multi-tenant? If multi-tenant, validate `tid` claim against allowed tenants.
5. **Certificate vs Secret**: for the app registration, use client certificate (preferred) or client secret?

## Integration With IDENTITY-ACCESS Domain

After `Microsoft.Identity.Web` validates the token:

- `User.FindFirst(ClaimTypes.NameIdentifier)?.Value` or `User.FindFirst("oid")?.Value` → resolves `User.id`
- Tenant context resolved per IDENTITY-ACCESS rules
- `ICurrentUserService` provides a clean abstraction over `HttpContext.User` for domain use
- `TenantMembership.status` must be `Active` before responding to any tenanted request
