"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const platform_governance_use_case_1 = require("../src/application/use-cases/iam/platform-governance.use-case");
const in_memory_platform_membership_repository_adapter_1 = require("../src/infrastructure/iam/in-memory-platform-membership-repository.adapter");
const in_memory_tenant_membership_repository_adapter_1 = require("../src/infrastructure/iam/in-memory-tenant-membership-repository.adapter");
const in_memory_audit_event_writer_adapter_1 = require("../src/infrastructure/iam/in-memory-audit-event-writer.adapter");
const in_memory_authorization_decision_logger_adapter_1 = require("../src/infrastructure/iam/in-memory-authorization-decision-logger.adapter");
function buildPlatformMembership(userId, status = 'Active') {
    return {
        userId,
        role: 'Superadmin',
        status,
        assignedAt: new Date('2026-04-22T08:00:00.000Z'),
        updatedAt: new Date('2026-04-22T08:00:00.000Z')
    };
}
function buildTenantMembership(tenantId, userId) {
    return {
        tenantId,
        userId,
        role: 'Owner',
        status: 'Active',
        createdAt: new Date('2026-04-22T08:00:00.000Z'),
        updatedAt: new Date('2026-04-22T08:00:00.000Z')
    };
}
function createUseCase(platformSeed, tenantSeed = []) {
    const platformRepository = new in_memory_platform_membership_repository_adapter_1.InMemoryPlatformMembershipRepositoryAdapter(platformSeed);
    const tenantRepository = new in_memory_tenant_membership_repository_adapter_1.InMemoryTenantMembershipRepositoryAdapter(tenantSeed);
    const auditWriter = new in_memory_audit_event_writer_adapter_1.InMemoryAuditEventWriterAdapter();
    const decisionLogger = new in_memory_authorization_decision_logger_adapter_1.InMemoryAuthorizationDecisionLoggerAdapter();
    const useCase = new platform_governance_use_case_1.PlatformGovernanceUseCase(platformRepository, tenantRepository, auditWriter, decisionLogger);
    return { useCase, platformRepository, auditWriter };
}
// ─────────────────────────────────────────────
// Suite: deny-by-default
// ─────────────────────────────────────────────
(0, vitest_1.describe)('platform governance — deny-by-default', () => {
    (0, vitest_1.it)('TC-01: actor with no PlatformMembership calling listPlatformMembers throws platform.access.denied', async () => {
        const { useCase } = createUseCase([]);
        await (0, vitest_1.expect)(useCase.listPlatformMembers('unknown-user')).rejects.toMatchObject({
            code: 'platform.access.denied'
        });
    });
    (0, vitest_1.it)('TC-02: actor with no PlatformMembership calling listTenants throws platform.access.denied', async () => {
        const { useCase } = createUseCase([]);
        await (0, vitest_1.expect)(useCase.listTenants('unknown-user')).rejects.toMatchObject({
            code: 'platform.access.denied'
        });
    });
    (0, vitest_1.it)('TC-03: actor with no PlatformMembership calling assignSuperadmin throws platform.access.denied', async () => {
        const { useCase } = createUseCase([]);
        await (0, vitest_1.expect)(useCase.assignSuperadmin('unknown-user', 'target-001')).rejects.toMatchObject({
            code: 'platform.access.denied'
        });
    });
    (0, vitest_1.it)('TC-04: actor with no PlatformMembership calling revokeSuperadmin throws platform.access.denied', async () => {
        const { useCase } = createUseCase([]);
        await (0, vitest_1.expect)(useCase.revokeSuperadmin('unknown-user', 'target-001')).rejects.toMatchObject({
            code: 'platform.access.denied'
        });
    });
    (0, vitest_1.it)('TC-05: actor with Revoked PlatformMembership calling listPlatformMembers throws platform.access.denied', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001', 'Revoked')]);
        await (0, vitest_1.expect)(useCase.listPlatformMembers('superadmin-001')).rejects.toMatchObject({
            code: 'platform.access.denied'
        });
    });
});
// ─────────────────────────────────────────────
// Suite: listTenants
// ─────────────────────────────────────────────
(0, vitest_1.describe)('platform governance — listTenants', () => {
    (0, vitest_1.it)('TC-06: Superadmin can list all unique tenant IDs', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')], [
            buildTenantMembership('tenant-001', 'owner-001'),
            buildTenantMembership('tenant-002', 'owner-002')
        ]);
        const tenants = await useCase.listTenants('superadmin-001');
        (0, vitest_1.expect)(tenants).toHaveLength(2);
        (0, vitest_1.expect)(tenants).toContain('tenant-001');
        (0, vitest_1.expect)(tenants).toContain('tenant-002');
    });
    (0, vitest_1.it)('TC-07: tenant IDs are deduplicated across multiple membership records', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')], [
            buildTenantMembership('tenant-001', 'owner-001'),
            buildTenantMembership('tenant-001', 'member-001')
        ]);
        const tenants = await useCase.listTenants('superadmin-001');
        (0, vitest_1.expect)(tenants).toHaveLength(1);
        (0, vitest_1.expect)(tenants[0]).toBe('tenant-001');
    });
});
// ─────────────────────────────────────────────
// Suite: listPlatformMembers
// ─────────────────────────────────────────────
(0, vitest_1.describe)('platform governance — listPlatformMembers', () => {
    (0, vitest_1.it)('TC-08: Superadmin can list all platform members', async () => {
        const { useCase } = createUseCase([
            buildPlatformMembership('superadmin-001'),
            buildPlatformMembership('superadmin-002')
        ]);
        const members = await useCase.listPlatformMembers('superadmin-001');
        (0, vitest_1.expect)(members).toHaveLength(2);
    });
    (0, vitest_1.it)('TC-09: returns array with only actor when no other platform members exist', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);
        const members = await useCase.listPlatformMembers('superadmin-001');
        (0, vitest_1.expect)(members).toHaveLength(1);
        (0, vitest_1.expect)(members[0].userId).toBe('superadmin-001');
    });
});
// ─────────────────────────────────────────────
// Suite: assignSuperadmin
// ─────────────────────────────────────────────
(0, vitest_1.describe)('platform governance — assignSuperadmin', () => {
    (0, vitest_1.it)('TC-10: Superadmin can assign Superadmin to a new user with Active status', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);
        const result = await useCase.assignSuperadmin('superadmin-001', 'new-user-001');
        (0, vitest_1.expect)(result.userId).toBe('new-user-001');
        (0, vitest_1.expect)(result.role).toBe('Superadmin');
        (0, vitest_1.expect)(result.status).toBe('Active');
    });
    (0, vitest_1.it)('TC-11: audit event with action platform.superadmin.assigned is emitted', async () => {
        const { useCase, auditWriter } = createUseCase([buildPlatformMembership('superadmin-001')]);
        await useCase.assignSuperadmin('superadmin-001', 'new-user-001');
        const events = auditWriter.list();
        (0, vitest_1.expect)(events).toHaveLength(1);
        (0, vitest_1.expect)(events[0].action).toBe('platform.superadmin.assigned');
    });
    (0, vitest_1.it)('TC-12: audit event contains actorUserId, targetUserId, and role metadata', async () => {
        const { useCase, auditWriter } = createUseCase([buildPlatformMembership('superadmin-001')]);
        await useCase.assignSuperadmin('superadmin-001', 'new-user-001');
        const events = auditWriter.list();
        (0, vitest_1.expect)(events[0].actorUserId).toBe('superadmin-001');
        (0, vitest_1.expect)(events[0].targetUserId).toBe('new-user-001');
        (0, vitest_1.expect)(events[0].metadata.role).toBe('Superadmin');
    });
    (0, vitest_1.it)('TC-13: assigning to an already-Active Superadmin re-activates without error', async () => {
        const { useCase } = createUseCase([
            buildPlatformMembership('superadmin-001'),
            buildPlatformMembership('already-superadmin', 'Active')
        ]);
        const result = await useCase.assignSuperadmin('superadmin-001', 'already-superadmin');
        (0, vitest_1.expect)(result.status).toBe('Active');
        (0, vitest_1.expect)(result.role).toBe('Superadmin');
    });
});
// ─────────────────────────────────────────────
// Suite: revokeSuperadmin
// ─────────────────────────────────────────────
(0, vitest_1.describe)('platform governance — revokeSuperadmin', () => {
    (0, vitest_1.it)('TC-14: Superadmin can revoke another Superadmin; result has status Revoked', async () => {
        const { useCase } = createUseCase([
            buildPlatformMembership('superadmin-001'),
            buildPlatformMembership('superadmin-002')
        ]);
        const result = await useCase.revokeSuperadmin('superadmin-001', 'superadmin-002');
        (0, vitest_1.expect)(result.status).toBe('Revoked');
    });
    (0, vitest_1.it)('TC-15: audit event with action platform.superadmin.revoked is emitted', async () => {
        const { useCase, auditWriter } = createUseCase([
            buildPlatformMembership('superadmin-001'),
            buildPlatformMembership('superadmin-002')
        ]);
        await useCase.revokeSuperadmin('superadmin-001', 'superadmin-002');
        const events = auditWriter.list();
        (0, vitest_1.expect)(events).toHaveLength(1);
        (0, vitest_1.expect)(events[0].action).toBe('platform.superadmin.revoked');
    });
    (0, vitest_1.it)('TC-16: audit event contains actorUserId, targetUserId, and previousStatus metadata', async () => {
        const { useCase, auditWriter } = createUseCase([
            buildPlatformMembership('superadmin-001'),
            buildPlatformMembership('superadmin-002')
        ]);
        await useCase.revokeSuperadmin('superadmin-001', 'superadmin-002');
        const events = auditWriter.list();
        (0, vitest_1.expect)(events[0].actorUserId).toBe('superadmin-001');
        (0, vitest_1.expect)(events[0].targetUserId).toBe('superadmin-002');
        (0, vitest_1.expect)(events[0].metadata.previousStatus).toBe('Active');
    });
    (0, vitest_1.it)('TC-17: self-revoke throws platform.self_revoke_forbidden', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);
        await (0, vitest_1.expect)(useCase.revokeSuperadmin('superadmin-001', 'superadmin-001')).rejects.toMatchObject({ code: 'platform.self_revoke_forbidden' });
    });
    (0, vitest_1.it)('TC-18: revoking a non-existent platform member throws membership.not_found', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);
        await (0, vitest_1.expect)(useCase.revokeSuperadmin('superadmin-001', 'ghost-user')).rejects.toMatchObject({ code: 'membership.not_found' });
    });
});
// ─────────────────────────────────────────────
// Suite: PlatformRole isolation (TC-19, TC-20)
// ─────────────────────────────────────────────
(0, vitest_1.describe)('platform governance — PlatformRole isolation', () => {
    (0, vitest_1.it)('TC-19: PlatformMembership has no tenantId field', async () => {
        const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);
        const members = await useCase.listPlatformMembers('superadmin-001');
        (0, vitest_1.expect)(members[0]).not.toHaveProperty('tenantId');
    });
});
