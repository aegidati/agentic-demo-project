"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIamPlatformRoutes = registerIamPlatformRoutes;
const platform_governance_use_case_1 = require("../../../application/use-cases/iam/platform-governance.use-case");
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
        const status = platform_governance_use_case_1.PlatformGovernanceUseCase.mapErrorToHttpStatus(error.code);
        return reply.status(status).send(buildProblem(status, error.code, error.message));
    }
    return reply.status(500).send(buildProblem(500, 'request.invalid_payload', 'Unexpected error'));
}
function registerIamPlatformRoutes(app, dependencies) {
    app.get('/platform/memberships', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const members = await dependencies.platformGovernanceUseCase.listPlatformMembers(actorUserId);
            return reply.send({ items: members, total: members.length });
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.post('/platform/memberships', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            if (!request.body || typeof request.body.userId !== 'string' || !request.body.userId) {
                throw new authorization_errors_1.AuthorizationError('request.invalid_payload', 'Missing or invalid userId in request body.');
            }
            const membership = await dependencies.platformGovernanceUseCase.assignSuperadmin(actorUserId, request.body.userId);
            return reply.status(201).send(membership);
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.delete('/platform/memberships/:userId', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const membership = await dependencies.platformGovernanceUseCase.revokeSuperadmin(actorUserId, request.params.userId);
            return reply.send(membership);
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
    app.get('/platform/tenants', async (request, reply) => {
        try {
            const actorUserId = getActorUserId(request);
            const tenantIds = await dependencies.platformGovernanceUseCase.listTenants(actorUserId);
            return reply.send({ items: tenantIds, total: tenantIds.length });
        }
        catch (error) {
            return handleError(error, reply);
        }
    });
}
