"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAuditEventWriterFromEnv = resolveAuditEventWriterFromEnv;
exports.buildApp = buildApp;
exports.startServer = startServer;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const get_health_status_use_case_1 = require("./application/use-cases/get-health-status.use-case");
const membership_governance_use_case_1 = require("./application/use-cases/iam/membership-governance.use-case");
const file_audit_event_writer_adapter_1 = require("./infrastructure/iam/file-audit-event-writer.adapter");
const in_memory_audit_event_writer_adapter_1 = require("./infrastructure/iam/in-memory-audit-event-writer.adapter");
const in_memory_authorization_decision_logger_adapter_1 = require("./infrastructure/iam/in-memory-authorization-decision-logger.adapter");
const in_memory_health_check_adapter_1 = require("./infrastructure/health/in-memory-health-check.adapter");
const default_tenant_context_resolver_adapter_1 = require("./infrastructure/iam/default-tenant-context-resolver.adapter");
const in_memory_global_user_status_reader_adapter_1 = require("./infrastructure/iam/in-memory-global-user-status-reader.adapter");
const in_memory_tenant_membership_repository_adapter_1 = require("./infrastructure/iam/in-memory-tenant-membership-repository.adapter");
const health_routes_1 = require("./presentation/http/routes/health.routes");
const iam_memberships_routes_1 = require("./presentation/http/routes/iam-memberships.routes");
function resolveAuditEventWriterFromEnv() {
    const sink = (process.env.IAM_AUDIT_SINK ?? 'in-memory').toLowerCase();
    if (sink === 'file') {
        const retentionDays = Number(process.env.IAM_AUDIT_RETENTION_DAYS ?? '365');
        const filePath = process.env.IAM_AUDIT_FILE_PATH ?? './var/audit-events.ndjson';
        return new file_audit_event_writer_adapter_1.FileAuditEventWriterAdapter({
            filePath,
            retentionDays: Number.isFinite(retentionDays) ? retentionDays : 365
        });
    }
    return new in_memory_audit_event_writer_adapter_1.InMemoryAuditEventWriterAdapter();
}
async function buildApp(overrides = {}) {
    const app = (0, fastify_1.default)({ logger: true });
    await app.register(cors_1.default, {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true
    });
    const healthCheckAdapter = new in_memory_health_check_adapter_1.InMemoryHealthCheckAdapter();
    const getHealthStatusUseCase = new get_health_status_use_case_1.GetHealthStatusUseCase(healthCheckAdapter);
    const tenantContextResolver = new default_tenant_context_resolver_adapter_1.DefaultTenantContextResolverAdapter();
    const membershipSeed = [
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
    const globalUserSeed = [
        { userId: 'owner-001', globalStatus: 'Active' },
        { userId: 'member-001', globalStatus: 'Active' },
        { userId: 'owner-002', globalStatus: 'Active' },
        { userId: 'disabled-001', globalStatus: 'Disabled' }
    ];
    const membershipRepository = new in_memory_tenant_membership_repository_adapter_1.InMemoryTenantMembershipRepositoryAdapter(membershipSeed);
    const globalUserStatusReader = new in_memory_global_user_status_reader_adapter_1.InMemoryGlobalUserStatusReaderAdapter(globalUserSeed);
    const auditEventWriter = overrides.auditEventWriter ?? resolveAuditEventWriterFromEnv();
    const decisionLogger = overrides.decisionLogger ?? new in_memory_authorization_decision_logger_adapter_1.InMemoryAuthorizationDecisionLoggerAdapter();
    const membershipGovernanceUseCase = new membership_governance_use_case_1.MembershipGovernanceUseCase(membershipRepository, globalUserStatusReader, auditEventWriter, decisionLogger);
    (0, health_routes_1.registerHealthRoutes)(app, { getHealthStatusUseCase });
    (0, iam_memberships_routes_1.registerIamMembershipRoutes)(app, {
        membershipGovernanceUseCase,
        tenantContextResolver
    });
    return app;
}
async function startServer() {
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
