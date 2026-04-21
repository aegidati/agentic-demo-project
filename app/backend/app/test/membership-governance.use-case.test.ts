import { describe, expect, it } from 'vitest';
import { MembershipGovernanceUseCase } from '../src/application/use-cases/iam/membership-governance.use-case';
import type { AuditEventWriterPort } from '../src/application/ports/iam/audit-event-writer.port';
import type { GlobalUserProfile } from '../src/domain/iam/global-user-status';
import type { TenantMembership } from '../src/domain/iam/tenant-membership';
import { InMemoryAuditEventWriterAdapter } from '../src/infrastructure/iam/in-memory-audit-event-writer.adapter';
import { InMemoryAuthorizationDecisionLoggerAdapter } from '../src/infrastructure/iam/in-memory-authorization-decision-logger.adapter';
import { InMemoryGlobalUserStatusReaderAdapter } from '../src/infrastructure/iam/in-memory-global-user-status-reader.adapter';
import { InMemoryTenantMembershipRepositoryAdapter } from '../src/infrastructure/iam/in-memory-tenant-membership-repository.adapter';

function createUseCase(
  seedMemberships: TenantMembership[],
  globalUsers: GlobalUserProfile[],
  overrides?: {
    auditWriter?: AuditEventWriterPort;
  }
) {
  const repository = new InMemoryTenantMembershipRepositoryAdapter(seedMemberships);
  const globalReader = new InMemoryGlobalUserStatusReaderAdapter(globalUsers);
  const auditWriter = overrides?.auditWriter ?? new InMemoryAuditEventWriterAdapter();
  const decisionLogger = new InMemoryAuthorizationDecisionLoggerAdapter();
  const useCase = new MembershipGovernanceUseCase(
    repository,
    globalReader,
    auditWriter,
    decisionLogger
  );
  return { useCase, repository };
}

function buildMembership(
  tenantId: string,
  userId: string,
  role: TenantMembership['role'],
  status: TenantMembership['status']
): TenantMembership {
  return {
    tenantId,
    userId,
    role,
    status,
    createdAt: new Date('2026-04-21T08:00:00.000Z'),
    updatedAt: new Date('2026-04-21T08:00:00.000Z')
  };
}

describe('membership governance use case', () => {
  it('blocks explicit self-elevation branch for admin to owner', async () => {
    const { useCase } = createUseCase(
      [buildMembership('tenant-001', 'admin-001', 'Admin', 'Active')],
      [{ userId: 'admin-001', globalStatus: 'Active' }]
    );

    await expect(
      useCase.updateRole('tenant-001', 'admin-001', 'admin-001', 'Owner')
    ).rejects.toMatchObject({
      code: 'membership.self_elevation'
    });
  });

  it('denies suspended actor as non-eligible tenant membership', async () => {
    const { useCase } = createUseCase(
      [buildMembership('tenant-001', 'member-001', 'Member', 'Suspended')],
      [{ userId: 'member-001', globalStatus: 'Active' }]
    );

    await expect(useCase.list('tenant-001', 'member-001')).rejects.toMatchObject({
      code: 'auth.forbidden'
    });
  });

  it('denies revoked actor as non-eligible tenant membership', async () => {
    const { useCase } = createUseCase(
      [buildMembership('tenant-001', 'member-001', 'Member', 'Revoked')],
      [{ userId: 'member-001', globalStatus: 'Active' }]
    );

    await expect(useCase.list('tenant-001', 'member-001')).rejects.toMatchObject({
      code: 'auth.forbidden'
    });
  });

  it('allows valid ownership transfer path while preserving one active owner', async () => {
    const { useCase, repository } = createUseCase(
      [
        buildMembership('tenant-001', 'owner-a', 'Owner', 'Active'),
        buildMembership('tenant-001', 'owner-b', 'Owner', 'Active')
      ],
      [
        { userId: 'owner-a', globalStatus: 'Active' },
        { userId: 'owner-b', globalStatus: 'Active' }
      ]
    );

    const updated = await useCase.updateRole('tenant-001', 'owner-a', 'owner-a', 'Admin');
    expect(updated.role).toBe('Admin');

    const memberships = await repository.listByTenantId('tenant-001');
    const activeOwners = memberships.filter((m) => m.status === 'Active' && m.role === 'Owner');
    expect(activeOwners).toHaveLength(1);
    expect(activeOwners[0].userId).toBe('owner-b');
  });

  it('prevents concurrent demotions from removing the last active owner', async () => {
    const { useCase, repository } = createUseCase(
      [
        buildMembership('tenant-001', 'owner-a', 'Owner', 'Active'),
        buildMembership('tenant-001', 'owner-b', 'Owner', 'Active')
      ],
      [
        { userId: 'owner-a', globalStatus: 'Active' },
        { userId: 'owner-b', globalStatus: 'Active' }
      ]
    );

    const results = await Promise.allSettled([
      useCase.updateRole('tenant-001', 'owner-a', 'owner-a', 'Admin'),
      useCase.updateRole('tenant-001', 'owner-b', 'owner-b', 'Admin')
    ]);

    const fulfilled = results.filter((result) => result.status === 'fulfilled');
    const rejected = results.filter((result) => result.status === 'rejected');

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toMatchObject({
      code: 'membership.last_owner_protection'
    });

    const memberships = await repository.listByTenantId('tenant-001');
    const activeOwners = memberships.filter((m) => m.status === 'Active' && m.role === 'Owner');
    expect(activeOwners).toHaveLength(1);
  });

  it('rolls back role mutation when audit append fails', async () => {
    const failingAuditWriter: AuditEventWriterPort = {
      append: async () => {
        throw new Error('audit store unavailable');
      }
    };

    const { useCase, repository } = createUseCase(
      [
        buildMembership('tenant-001', 'owner-001', 'Owner', 'Active'),
        buildMembership('tenant-001', 'member-001', 'Member', 'Active')
      ],
      [
        { userId: 'owner-001', globalStatus: 'Active' },
        { userId: 'member-001', globalStatus: 'Active' }
      ],
      {
        auditWriter: failingAuditWriter
      }
    );

    await expect(
      useCase.updateRole('tenant-001', 'owner-001', 'member-001', 'Viewer')
    ).rejects.toThrow('audit store unavailable');

    const member = await repository.findByIdentity({
      tenantId: 'tenant-001',
      userId: 'member-001'
    });
    expect(member?.role).toBe('Member');
  });
});
