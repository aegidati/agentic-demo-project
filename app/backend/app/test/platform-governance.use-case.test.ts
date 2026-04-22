import { describe, expect, it } from 'vitest';
import { PlatformGovernanceUseCase } from '../src/application/use-cases/iam/platform-governance.use-case';
import { InMemoryPlatformMembershipRepositoryAdapter } from '../src/infrastructure/iam/in-memory-platform-membership-repository.adapter';
import { InMemoryTenantMembershipRepositoryAdapter } from '../src/infrastructure/iam/in-memory-tenant-membership-repository.adapter';
import { InMemoryAuditEventWriterAdapter } from '../src/infrastructure/iam/in-memory-audit-event-writer.adapter';
import { InMemoryAuthorizationDecisionLoggerAdapter } from '../src/infrastructure/iam/in-memory-authorization-decision-logger.adapter';
import type { PlatformMembership } from '../src/domain/iam/platform-role';
import type { TenantMembership } from '../src/domain/iam/tenant-membership';

function buildPlatformMembership(
  userId: string,
  status: PlatformMembership['status'] = 'Active'
): PlatformMembership {
  return {
    userId,
    role: 'Superadmin',
    status,
    assignedAt: new Date('2026-04-22T08:00:00.000Z'),
    updatedAt: new Date('2026-04-22T08:00:00.000Z')
  };
}

function buildTenantMembership(tenantId: string, userId: string): TenantMembership {
  return {
    tenantId,
    userId,
    role: 'Owner',
    status: 'Active',
    createdAt: new Date('2026-04-22T08:00:00.000Z'),
    updatedAt: new Date('2026-04-22T08:00:00.000Z')
  };
}

function createUseCase(
  platformSeed: PlatformMembership[],
  tenantSeed: TenantMembership[] = []
) {
  const platformRepository = new InMemoryPlatformMembershipRepositoryAdapter(platformSeed);
  const tenantRepository = new InMemoryTenantMembershipRepositoryAdapter(tenantSeed);
  const auditWriter = new InMemoryAuditEventWriterAdapter();
  const decisionLogger = new InMemoryAuthorizationDecisionLoggerAdapter();
  const useCase = new PlatformGovernanceUseCase(
    platformRepository,
    tenantRepository,
    auditWriter,
    decisionLogger
  );
  return { useCase, platformRepository, auditWriter };
}

// ─────────────────────────────────────────────
// Suite: deny-by-default
// ─────────────────────────────────────────────
describe('platform governance — deny-by-default', () => {
  it('TC-01: actor with no PlatformMembership calling listPlatformMembers throws platform.access.denied', async () => {
    const { useCase } = createUseCase([]);
    await expect(useCase.listPlatformMembers('unknown-user')).rejects.toMatchObject({
      code: 'platform.access.denied'
    });
  });

  it('TC-02: actor with no PlatformMembership calling listTenants throws platform.access.denied', async () => {
    const { useCase } = createUseCase([]);
    await expect(useCase.listTenants('unknown-user')).rejects.toMatchObject({
      code: 'platform.access.denied'
    });
  });

  it('TC-03: actor with no PlatformMembership calling assignSuperadmin throws platform.access.denied', async () => {
    const { useCase } = createUseCase([]);
    await expect(useCase.assignSuperadmin('unknown-user', 'target-001')).rejects.toMatchObject({
      code: 'platform.access.denied'
    });
  });

  it('TC-04: actor with no PlatformMembership calling revokeSuperadmin throws platform.access.denied', async () => {
    const { useCase } = createUseCase([]);
    await expect(useCase.revokeSuperadmin('unknown-user', 'target-001')).rejects.toMatchObject({
      code: 'platform.access.denied'
    });
  });

  it('TC-05: actor with Revoked PlatformMembership calling listPlatformMembers throws platform.access.denied', async () => {
    const { useCase } = createUseCase([buildPlatformMembership('superadmin-001', 'Revoked')]);
    await expect(useCase.listPlatformMembers('superadmin-001')).rejects.toMatchObject({
      code: 'platform.access.denied'
    });
  });
});

// ─────────────────────────────────────────────
// Suite: listTenants
// ─────────────────────────────────────────────
describe('platform governance — listTenants', () => {
  it('TC-06: Superadmin can list all unique tenant IDs', async () => {
    const { useCase } = createUseCase(
      [buildPlatformMembership('superadmin-001')],
      [
        buildTenantMembership('tenant-001', 'owner-001'),
        buildTenantMembership('tenant-002', 'owner-002')
      ]
    );

    const tenants = await useCase.listTenants('superadmin-001');
    expect(tenants).toHaveLength(2);
    expect(tenants).toContain('tenant-001');
    expect(tenants).toContain('tenant-002');
  });

  it('TC-07: tenant IDs are deduplicated across multiple membership records', async () => {
    const { useCase } = createUseCase(
      [buildPlatformMembership('superadmin-001')],
      [
        buildTenantMembership('tenant-001', 'owner-001'),
        buildTenantMembership('tenant-001', 'member-001')
      ]
    );

    const tenants = await useCase.listTenants('superadmin-001');
    expect(tenants).toHaveLength(1);
    expect(tenants[0]).toBe('tenant-001');
  });
});

// ─────────────────────────────────────────────
// Suite: listPlatformMembers
// ─────────────────────────────────────────────
describe('platform governance — listPlatformMembers', () => {
  it('TC-08: Superadmin can list all platform members', async () => {
    const { useCase } = createUseCase([
      buildPlatformMembership('superadmin-001'),
      buildPlatformMembership('superadmin-002')
    ]);

    const members = await useCase.listPlatformMembers('superadmin-001');
    expect(members).toHaveLength(2);
  });

  it('TC-09: returns array with only actor when no other platform members exist', async () => {
    const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);

    const members = await useCase.listPlatformMembers('superadmin-001');
    expect(members).toHaveLength(1);
    expect(members[0].userId).toBe('superadmin-001');
  });
});

// ─────────────────────────────────────────────
// Suite: assignSuperadmin
// ─────────────────────────────────────────────
describe('platform governance — assignSuperadmin', () => {
  it('TC-10: Superadmin can assign Superadmin to a new user with Active status', async () => {
    const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);

    const result = await useCase.assignSuperadmin('superadmin-001', 'new-user-001');
    expect(result.userId).toBe('new-user-001');
    expect(result.role).toBe('Superadmin');
    expect(result.status).toBe('Active');
  });

  it('TC-11: audit event with action platform.superadmin.assigned is emitted', async () => {
    const { useCase, auditWriter } = createUseCase([buildPlatformMembership('superadmin-001')]);

    await useCase.assignSuperadmin('superadmin-001', 'new-user-001');

    const events = auditWriter.list();
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe('platform.superadmin.assigned');
  });

  it('TC-12: audit event contains actorUserId, targetUserId, and role metadata', async () => {
    const { useCase, auditWriter } = createUseCase([buildPlatformMembership('superadmin-001')]);

    await useCase.assignSuperadmin('superadmin-001', 'new-user-001');

    const events = auditWriter.list();
    expect(events[0].actorUserId).toBe('superadmin-001');
    expect(events[0].targetUserId).toBe('new-user-001');
    expect(events[0].metadata.role).toBe('Superadmin');
  });

  it('TC-13: assigning to an already-Active Superadmin re-activates without error', async () => {
    const { useCase } = createUseCase([
      buildPlatformMembership('superadmin-001'),
      buildPlatformMembership('already-superadmin', 'Active')
    ]);

    const result = await useCase.assignSuperadmin('superadmin-001', 'already-superadmin');
    expect(result.status).toBe('Active');
    expect(result.role).toBe('Superadmin');
  });
});

// ─────────────────────────────────────────────
// Suite: revokeSuperadmin
// ─────────────────────────────────────────────
describe('platform governance — revokeSuperadmin', () => {
  it('TC-14: Superadmin can revoke another Superadmin; result has status Revoked', async () => {
    const { useCase } = createUseCase([
      buildPlatformMembership('superadmin-001'),
      buildPlatformMembership('superadmin-002')
    ]);

    const result = await useCase.revokeSuperadmin('superadmin-001', 'superadmin-002');
    expect(result.status).toBe('Revoked');
  });

  it('TC-15: audit event with action platform.superadmin.revoked is emitted', async () => {
    const { useCase, auditWriter } = createUseCase([
      buildPlatformMembership('superadmin-001'),
      buildPlatformMembership('superadmin-002')
    ]);

    await useCase.revokeSuperadmin('superadmin-001', 'superadmin-002');

    const events = auditWriter.list();
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe('platform.superadmin.revoked');
  });

  it('TC-16: audit event contains actorUserId, targetUserId, and previousStatus metadata', async () => {
    const { useCase, auditWriter } = createUseCase([
      buildPlatformMembership('superadmin-001'),
      buildPlatformMembership('superadmin-002')
    ]);

    await useCase.revokeSuperadmin('superadmin-001', 'superadmin-002');

    const events = auditWriter.list();
    expect(events[0].actorUserId).toBe('superadmin-001');
    expect(events[0].targetUserId).toBe('superadmin-002');
    expect(events[0].metadata.previousStatus).toBe('Active');
  });

  it('TC-17: self-revoke throws platform.self_revoke_forbidden', async () => {
    const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);

    await expect(
      useCase.revokeSuperadmin('superadmin-001', 'superadmin-001')
    ).rejects.toMatchObject({ code: 'platform.self_revoke_forbidden' });
  });

  it('TC-18: revoking a non-existent platform member throws membership.not_found', async () => {
    const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);

    await expect(
      useCase.revokeSuperadmin('superadmin-001', 'ghost-user')
    ).rejects.toMatchObject({ code: 'membership.not_found' });
  });
});

// ─────────────────────────────────────────────
// Suite: PlatformRole isolation (TC-19, TC-20)
// ─────────────────────────────────────────────
describe('platform governance — PlatformRole isolation', () => {
  it('TC-19: PlatformMembership has no tenantId field', async () => {
    const { useCase } = createUseCase([buildPlatformMembership('superadmin-001')]);

    const members = await useCase.listPlatformMembers('superadmin-001');
    expect(members[0]).not.toHaveProperty('tenantId');
  });
});
