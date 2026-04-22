"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformGovernanceUseCase = void 0;
const node_crypto_1 = require("node:crypto");
const authorization_errors_1 = require("../../../domain/iam/authorization-errors");
class PlatformGovernanceUseCase {
    platformRepository;
    tenantRepository;
    auditEventWriter;
    decisionLogger;
    constructor(platformRepository, tenantRepository, auditEventWriter, decisionLogger) {
        this.platformRepository = platformRepository;
        this.tenantRepository = tenantRepository;
        this.auditEventWriter = auditEventWriter;
        this.decisionLogger = decisionLogger;
    }
    async listTenants(actorUserId) {
        return this.withDecisionLogging({ actorUserId, operation: 'platform.tenant.list' }, async () => {
            await this.ensureActorIsSuperadmin(actorUserId);
            return this.tenantRepository.listAllTenantIds();
        });
    }
    async listPlatformMembers(actorUserId) {
        return this.withDecisionLogging({ actorUserId, operation: 'platform.members.list' }, async () => {
            await this.ensureActorIsSuperadmin(actorUserId);
            return this.platformRepository.listAll();
        });
    }
    async assignSuperadmin(actorUserId, targetUserId) {
        return this.withDecisionLogging({ actorUserId, operation: 'platform.superadmin.assign' }, async () => {
            await this.ensureActorIsSuperadmin(actorUserId);
            const existing = await this.platformRepository.findByUserId(targetUserId);
            let membership;
            if (existing) {
                membership = await this.platformRepository.update(targetUserId, {
                    status: 'Active'
                });
            }
            else {
                membership = await this.platformRepository.create({
                    userId: targetUserId,
                    role: 'Superadmin',
                    status: 'Active'
                });
            }
            await this.auditEventWriter.append({
                id: (0, node_crypto_1.randomUUID)(),
                tenantId: 'platform',
                actorUserId,
                targetUserId,
                action: 'platform.superadmin.assigned',
                metadata: {
                    role: 'Superadmin',
                    previousStatus: existing?.status ?? null
                },
                occurredAt: new Date(),
                correlationId: (0, node_crypto_1.randomUUID)()
            });
            return membership;
        });
    }
    async revokeSuperadmin(actorUserId, targetUserId) {
        return this.withDecisionLogging({ actorUserId, operation: 'platform.superadmin.revoke' }, async () => {
            await this.ensureActorIsSuperadmin(actorUserId);
            if (actorUserId === targetUserId) {
                throw new authorization_errors_1.AuthorizationError('platform.self_revoke_forbidden', 'A Superadmin cannot revoke their own platform role.');
            }
            const existing = await this.platformRepository.findByUserId(targetUserId);
            if (!existing) {
                throw new authorization_errors_1.AuthorizationError('membership.not_found', 'Platform membership not found for target user.');
            }
            const membership = await this.platformRepository.update(targetUserId, {
                status: 'Revoked'
            });
            await this.auditEventWriter.append({
                id: (0, node_crypto_1.randomUUID)(),
                tenantId: 'platform',
                actorUserId,
                targetUserId,
                action: 'platform.superadmin.revoked',
                metadata: {
                    role: 'Superadmin',
                    previousStatus: existing.status
                },
                occurredAt: new Date(),
                correlationId: (0, node_crypto_1.randomUUID)()
            });
            return membership;
        });
    }
    static mapErrorToHttpStatus(code) {
        switch (code) {
            case 'auth.missing_actor':
                return 401;
            case 'platform.access.denied':
            case 'platform.self_revoke_forbidden':
            case 'auth.forbidden':
                return 403;
            case 'membership.not_found':
                return 404;
            case 'auth.tenant_context_conflict':
            case 'membership.invalid_transition':
            case 'membership.last_owner_protection':
            case 'membership.self_elevation':
                return 409;
            case 'request.invalid_payload':
                return 422;
            default:
                return 500;
        }
    }
    async ensureActorIsSuperadmin(actorUserId) {
        const membership = await this.platformRepository.findByUserId(actorUserId);
        if (!membership || membership.status !== 'Active') {
            throw new authorization_errors_1.AuthorizationError('platform.access.denied', 'Actor does not have an active Superadmin platform membership.');
        }
    }
    async withDecisionLogging(context, fn) {
        try {
            const result = await fn();
            await this.decisionLogger.record({
                tenantId: 'platform',
                actorUserId: context.actorUserId,
                operation: context.operation,
                decision: 'allow',
                occurredAt: new Date()
            });
            return result;
        }
        catch (error) {
            await this.decisionLogger.record({
                tenantId: 'platform',
                actorUserId: context.actorUserId,
                operation: context.operation,
                decision: 'deny',
                reasonCode: error instanceof authorization_errors_1.AuthorizationError ? error.code : 'unknown',
                occurredAt: new Date()
            });
            throw error;
        }
    }
}
exports.PlatformGovernanceUseCase = PlatformGovernanceUseCase;
