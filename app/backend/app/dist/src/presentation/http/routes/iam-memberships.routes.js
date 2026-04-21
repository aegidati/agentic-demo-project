"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIamMembershipRoutes = registerIamMembershipRoutes;
const membership_governance_use_case_1 = require("../../../application/use-cases/iam/membership-governance.use-case");
const authorization_errors_1 = require("../../../domain/iam/authorization-errors");
function getActorUserId(request) {
    const actorUserIdHeader = request.headers['x-actor-user-id'];
    const actorUserId = Array.isArray(actorUserIdHeader)
        ? actorUserIdHeader[0]
        : actorUserIdHeader;
    if (!actorUserId) {
        throw new authorization_errors_1.AuthorizationError('auth.missing_actor', 'Missing x-actor-user-id header.');
    }
    return actorUserId;
}
function parseTenantHeader(request) {
    const headerValue = request.headers['x-tenant-id'];
    return Array.isArray(headerValue) ? headerValue[0] : headerValue;
}
function isMembershipStatus(value) {
    return value === 'Invited' || value === 'Active' || value === 'Suspended' || value === 'Revoked';
}
function isTenantRole(value) {
    return value === 'Owner' || value === 'Admin' || value === 'Member' || value === 'Viewer';
}
function buildProblem(status, code, detail) {
    return {
        type: 'about:blank',
        title: status >= 500 ? 'Internal Server Error' : 'Request Failed',
        status,
        errorCode: code,
        detail,
        traceId: `trace-${Date.now()}`
    };
}
function handleError(error, reply) {
    if (error instanceof authorization_errors_1.AuthorizationError) {
        const status = membership_governance_use_case_1.MembershipGovernanceUseCase.mapErrorToHttpStatus(error.code);
        return reply.status(status).send(buildProblem(status, error.code, error.message));
    }
    return reply.status(500).send(buildProblem(500, 'request.invalid_payload', 'Unexpected error'));
}
function registerIamMembershipRoutes(app, dependencies) {
    app.get('/tenants/:tenantId/memberships', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantId = dependencies.tenantContextResolver.resolve({
                pathTenantId: request.params.tenantId,
                headerTenantId: parseTenantHeader(request)
            });
            const items = await dependencies.membershipGovernanceUseCase.list(tenantId, actorUserId);
            return reply.send({ items, total: items.length });
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.get('/tenants/:tenantId/memberships/:userId', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantId = dependencies.tenantContextResolver.resolve({
                pathTenantId: request.params.tenantId,
                headerTenantId: parseTenantHeader(request)
            });
            const membership = await dependencies.membershipGovernanceUseCase.get(tenantId, actorUserId, request.params.userId);
            return reply.send(membership);
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.post('/tenants/:tenantId/memberships', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantId = dependencies.tenantContextResolver.resolve({
                pathTenantId: request.params.tenantId,
                headerTenantId: parseTenantHeader(request)
            });
            if (!request.body || !isTenantRole(request.body.role) || !isMembershipStatus(request.body.status)) {
                throw new authorization_errors_1.AuthorizationError('request.invalid_payload', 'Invalid create membership payload.');
            }
            const created = await dependencies.membershipGovernanceUseCase.create(tenantId, actorUserId, request.body.userId, request.body.role, request.body.status);
            return reply.status(201).send(created);
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.patch('/tenants/:tenantId/memberships/:userId/status', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantId = dependencies.tenantContextResolver.resolve({
                pathTenantId: request.params.tenantId,
                headerTenantId: parseTenantHeader(request)
            });
            if (!request.body || !isMembershipStatus(request.body.status)) {
                throw new authorization_errors_1.AuthorizationError('request.invalid_payload', 'Invalid membership status payload.');
            }
            const updated = await dependencies.membershipGovernanceUseCase.updateStatus(tenantId, actorUserId, request.params.userId, request.body.status);
            return reply.send(updated);
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.patch('/tenants/:tenantId/memberships/:userId/role', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantId = dependencies.tenantContextResolver.resolve({
                pathTenantId: request.params.tenantId,
                headerTenantId: parseTenantHeader(request)
            });
            if (!request.body || !isTenantRole(request.body.role)) {
                throw new authorization_errors_1.AuthorizationError('request.invalid_payload', 'Invalid membership role payload.');
            }
            const updated = await dependencies.membershipGovernanceUseCase.updateRole(tenantId, actorUserId, request.params.userId, request.body.role);
            return reply.send(updated);
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.delete('/tenants/:tenantId/memberships/:userId', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantId = dependencies.tenantContextResolver.resolve({
                pathTenantId: request.params.tenantId,
                headerTenantId: parseTenantHeader(request)
            });
            await dependencies.membershipGovernanceUseCase.delete(tenantId, actorUserId, request.params.userId);
            return reply.status(204).send();
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
}
