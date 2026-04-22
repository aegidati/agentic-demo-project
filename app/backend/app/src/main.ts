import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import type { AuditEventWriterPort } from './application/ports/iam/audit-event-writer.port';
import type { AuthorizationDecisionLoggerPort } from './application/ports/iam/authorization-decision-logger.port';
import { GetHealthStatusUseCase } from './application/use-cases/get-health-status.use-case';
import { MembershipGovernanceUseCase } from './application/use-cases/iam/membership-governance.use-case';
import type { GlobalUserProfile } from './domain/iam/global-user-status';
import { FileAuditEventWriterAdapter } from './infrastructure/iam/file-audit-event-writer.adapter';
import { InMemoryAuditEventWriterAdapter } from './infrastructure/iam/in-memory-audit-event-writer.adapter';
import { InMemoryAuthorizationDecisionLoggerAdapter } from './infrastructure/iam/in-memory-authorization-decision-logger.adapter';
import { InMemoryHealthCheckAdapter } from './infrastructure/health/in-memory-health-check.adapter';
import { DefaultTenantContextResolverAdapter } from './infrastructure/iam/default-tenant-context-resolver.adapter';
import { InMemoryGlobalUserStatusReaderAdapter } from './infrastructure/iam/in-memory-global-user-status-reader.adapter';
import { InMemoryTenantMembershipRepositoryAdapter } from './infrastructure/iam/in-memory-tenant-membership-repository.adapter';
import type { TenantMembership } from './domain/iam/tenant-membership';
import { registerHealthRoutes } from './presentation/http/routes/health.routes';
import { registerIamMembershipRoutes } from './presentation/http/routes/iam-memberships.routes';

interface BuildAppOverrides {
  auditEventWriter?: AuditEventWriterPort;
  decisionLogger?: AuthorizationDecisionLoggerPort;
}

function resolveAuditEventWriterFromEnv(): AuditEventWriterPort {
  const sink = (process.env.IAM_AUDIT_SINK ?? 'in-memory').toLowerCase();
  if (sink === 'file') {
    const retentionDays = Number(process.env.IAM_AUDIT_RETENTION_DAYS ?? '365');
    const filePath = process.env.IAM_AUDIT_FILE_PATH ?? './var/audit-events.ndjson';
    return new FileAuditEventWriterAdapter({
      filePath,
      retentionDays: Number.isFinite(retentionDays) ? retentionDays : 365
    });
  }

  return new InMemoryAuditEventWriterAdapter();
}

export { resolveAuditEventWriterFromEnv };

export async function buildApp(overrides: BuildAppOverrides = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:3000,http://localhost:8080')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  await app.register(fastifyCors, {
    origin: corsOrigins,
    credentials: true
  });

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
  const auditEventWriter = overrides.auditEventWriter ?? resolveAuditEventWriterFromEnv();
  const decisionLogger =
    overrides.decisionLogger ?? new InMemoryAuthorizationDecisionLoggerAdapter();
  const membershipGovernanceUseCase = new MembershipGovernanceUseCase(
    membershipRepository,
    globalUserStatusReader,
    auditEventWriter,
    decisionLogger
  );

  registerHealthRoutes(app, { getHealthStatusUseCase });
  registerIamMembershipRoutes(app, {
    membershipGovernanceUseCase,
    tenantContextResolver
  });

  return app;
}

export async function startServer(): Promise<void> {
  const app = await buildApp();
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
