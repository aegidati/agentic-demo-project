import Fastify, { type FastifyInstance } from 'fastify';
import { GetHealthStatusUseCase } from './application/use-cases/get-health-status.use-case';
import { MembershipGovernanceUseCase } from './application/use-cases/iam/membership-governance.use-case';
import type { GlobalUserProfile } from './domain/iam/global-user-status';
import { InMemoryHealthCheckAdapter } from './infrastructure/health/in-memory-health-check.adapter';
import { DefaultTenantContextResolverAdapter } from './infrastructure/iam/default-tenant-context-resolver.adapter';
import { InMemoryGlobalUserStatusReaderAdapter } from './infrastructure/iam/in-memory-global-user-status-reader.adapter';
import { InMemoryTenantMembershipRepositoryAdapter } from './infrastructure/iam/in-memory-tenant-membership-repository.adapter';
import type { TenantMembership } from './domain/iam/tenant-membership';
import { registerHealthRoutes } from './presentation/http/routes/health.routes';
import { registerIamMembershipRoutes } from './presentation/http/routes/iam-memberships.routes';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  const healthCheckAdapter = new InMemoryHealthCheckAdapter();
  const getHealthStatusUseCase = new GetHealthStatusUseCase(healthCheckAdapter);
  const tenantContextResolver = new DefaultTenantContextResolverAdapter();

  const membershipSeed: TenantMembership[] = [
    {
      tenantId: 'tenant-001',
      userId: 'owner-001',
      role: 'Owner',
      status: 'Active',
      createdAt: new Date('2026-04-21T08:00:00.000Z'),
      updatedAt: new Date('2026-04-21T08:00:00.000Z')
    },
    {
      tenantId: 'tenant-001',
      userId: 'member-001',
      role: 'Member',
      status: 'Active',
      createdAt: new Date('2026-04-21T08:00:00.000Z'),
      updatedAt: new Date('2026-04-21T08:00:00.000Z')
    },
    {
      tenantId: 'tenant-002',
      userId: 'owner-002',
      role: 'Owner',
      status: 'Active',
      createdAt: new Date('2026-04-21T08:00:00.000Z'),
      updatedAt: new Date('2026-04-21T08:00:00.000Z')
    },
    {
      tenantId: 'tenant-001',
      userId: 'disabled-001',
      role: 'Admin',
      status: 'Active',
      createdAt: new Date('2026-04-21T08:00:00.000Z'),
      updatedAt: new Date('2026-04-21T08:00:00.000Z')
    }
  ];

  const globalUserSeed: GlobalUserProfile[] = [
    { userId: 'owner-001', globalStatus: 'Active' },
    { userId: 'member-001', globalStatus: 'Active' },
    { userId: 'owner-002', globalStatus: 'Active' },
    { userId: 'disabled-001', globalStatus: 'Disabled' }
  ];

  const membershipRepository = new InMemoryTenantMembershipRepositoryAdapter(membershipSeed);
  const globalUserStatusReader = new InMemoryGlobalUserStatusReaderAdapter(globalUserSeed);
  const membershipGovernanceUseCase = new MembershipGovernanceUseCase(
    membershipRepository,
    globalUserStatusReader
  );

  registerHealthRoutes(app, { getHealthStatusUseCase });
  registerIamMembershipRoutes(app, {
    membershipGovernanceUseCase,
    tenantContextResolver
  });

  return app;
}

export async function startServer(): Promise<void> {
  const app = buildApp();
  const host = process.env.HOST ?? '0.0.0.0';
  const port = Number(process.env.PORT ?? 3000);

  await app.listen({ host, port });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
