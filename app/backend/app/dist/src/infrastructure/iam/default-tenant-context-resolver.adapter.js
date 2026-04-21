"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTenantContextResolverAdapter = void 0;
const authorization_errors_1 = require("../../domain/iam/authorization-errors");
class DefaultTenantContextResolverAdapter {
    resolve(input) {
        const { pathTenantId, headerTenantId } = input;
        if (!pathTenantId) {
            throw new authorization_errors_1.AuthorizationError('auth.forbidden', 'Tenant context is required for tenant-scoped operations.');
        }
        if (headerTenantId && headerTenantId !== pathTenantId) {
            throw new authorization_errors_1.AuthorizationError('auth.tenant_context_conflict', 'Header tenant context conflicts with route tenant context.');
        }
        return pathTenantId;
    }
}
exports.DefaultTenantContextResolverAdapter = DefaultTenantContextResolverAdapter;
