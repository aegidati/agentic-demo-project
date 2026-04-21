"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const membership_governance_use_case_1 = require("../src/application/use-cases/iam/membership-governance.use-case");
const in_memory_audit_event_writer_adapter_1 = require("../src/infrastructure/iam/in-memory-audit-event-writer.adapter");
const in_memory_authorization_decision_logger_adapter_1 = require("../src/infrastructure/iam/in-memory-authorization-decision-logger.adapter");
const in_memory_global_user_status_reader_adapter_1 = require("../src/infrastructure/iam/in-memory-global-user-status-reader.adapter");
const in_memory_tenant_membership_repository_adapter_1 = require("../src/infrastructure/iam/in-memory-tenant-membership-repository.adapter");
function createUseCase(seedMemberships, globalUsers, overrides) {
    const repository = new in_memory_tenant_membership_repository_adapter_1.InMemoryTenantMembershipRepositoryAdapter(seedMemberships);
    const globalReader = new in_memory_global_user_status_reader_adapter_1.InMemoryGlobalUserStatusReaderAdapter(globalUsers);
    const auditWriter = overrides?.auditWriter ?? new in_memory_audit_event_writer_adapter_1.InMemoryAuditEventWriterAdapter();
    const decisionLogger = new in_memory_authorization_decision_logger_adapter_1.InMemoryAuthorizationDecisionLoggerAdapter();
    const useCase = new membership_governance_use_case_1.MembershipGovernanceUseCase(repository, globalReader, auditWriter, decisionLogger);
    return { useCase, repository };
}
function buildMembership(tenantId, userId, role, status) {
    return {
        tenantId,
        userId,
        role,
        status,
        createdAt: new Date('2026-04-21T08:00:00.000Z'),
        updatedAt: new Date('2026-04-21T08:00:00.000Z')
    };
}
(0, vitest_1.describe)('membership governance use case', () => {
    (0, vitest_1.it)('blocks explicit self-elevation branch for admin to owner', async () => {
        const { useCase } = createUseCase([buildMembership('tenant-001', 'admin-001', 'Admin', 'Active')], [{ userId: 'admin-001', globalStatus: 'Active' }]);
        await (0, vitest_1.expect)(useCase.updateRole('tenant-001', 'admin-001', 'admin-001', 'Owner')).rejects.toMatchObject({
            code: 'membership.self_elevation'
        });
    });
    (0, vitest_1.it)('denies suspended actor as non-eligible tenant membership', async () => {
        const { useCase } = createUseCase([buildMembership('tenant-001', 'member-001', 'Member', 'Suspended')], [{ userId: 'member-001', globalStatus: 'Active' }]);
        await (0, vitest_1.expect)(useCase.list('tenant-001', 'member-001')).rejects.toMatchObject({
            code: 'auth.forbidden'
        });
    });
    (0, vitest_1.it)('denies revoked actor as non-eligible tenant membership', async () => {
        const { useCase } = createUseCase([buildMembership('tenant-001', 'member-001', 'Member', 'Revoked')], [{ userId: 'member-001', globalStatus: 'Active' }]);
        await (0, vitest_1.expect)(useCase.list('tenant-001', 'member-001')).rejects.toMatchObject({
            code: 'auth.forbidden'
        });
    });
    (0, vitest_1.it)('allows valid ownership transfer path while preserving one active owner', async () => {
        const { useCase, repository } = createUseCase([
            buildMembership('tenant-001', 'owner-a', 'Owner', 'Active'),
            buildMembership('tenant-001', 'owner-b', 'Owner', 'Active')
        ], [
            { userId: 'owner-a', globalStatus: 'Active' },
            { userId: 'owner-b', globalStatus: 'Active' }
        ]);
        const updated = await useCase.updateRole('tenant-001', 'owner-a', 'owner-a', 'Admin');
        (0, vitest_1.expect)(updated.role).toBe('Admin');
        const memberships = await repository.listByTenantId('tenant-001');
        const activeOwners = memberships.filter((m) => m.status === 'Active' && m.role === 'Owner');
        (0, vitest_1.expect)(activeOwners).toHaveLength(1);
        (0, vitest_1.expect)(activeOwners[0].userId).toBe('owner-b');
    });
    (0, vitest_1.it)('prevents concurrent demotions from removing the last active owner', async () => {
        const { useCase, repository } = createUseCase([
            buildMembership('tenant-001', 'owner-a', 'Owner', 'Active'),
            buildMembership('tenant-001', 'owner-b', 'Owner', 'Active')
        ], [
            { userId: 'owner-a', globalStatus: 'Active' },
            { userId: 'owner-b', globalStatus: 'Active' }
        ]);
        const results = await Promise.allSettled([
            useCase.updateRole('tenant-001', 'owner-a', 'owner-a', 'Admin'),
            useCase.updateRole('tenant-001', 'owner-b', 'owner-b', 'Admin')
        ]);
        const fulfilled = results.filter((result) => result.status === 'fulfilled');
        const rejected = results.filter((result) => result.status === 'rejected');
        (0, vitest_1.expect)(fulfilled).toHaveLength(1);
        (0, vitest_1.expect)(rejected).toHaveLength(1);
        (0, vitest_1.expect)(rejected[0].reason).toMatchObject({
            code: 'membership.last_owner_protection'
        });
        const memberships = await repository.listByTenantId('tenant-001');
        const activeOwners = memberships.filter((m) => m.status === 'Active' && m.role === 'Owner');
        (0, vitest_1.expect)(activeOwners).toHaveLength(1);
    });
    (0, vitest_1.it)('rolls back role mutation when audit append fails', async () => {
        const failingAuditWriter = {
            append: async () => {
                throw new Error('audit store unavailable');
            }
        };
        const { useCase, repository } = createUseCase([
            buildMembership('tenant-001', 'owner-001', 'Owner', 'Active'),
            buildMembership('tenant-001', 'member-001', 'Member', 'Active')
        ], [
            { userId: 'owner-001', globalStatus: 'Active' },
            { userId: 'member-001', globalStatus: 'Active' }
        ], {
            auditWriter: failingAuditWriter
        });
        await (0, vitest_1.expect)(useCase.updateRole('tenant-001', 'owner-001', 'member-001', 'Viewer')).rejects.toThrow('audit store unavailable');
        const member = await repository.findByIdentity({
            tenantId: 'tenant-001',
            userId: 'member-001'
        });
        (0, vitest_1.expect)(member?.role).toBe('Member');
    });
});
