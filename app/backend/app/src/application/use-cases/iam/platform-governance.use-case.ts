import { randomUUID } from 'node:crypto';
import type { AuditEventWriterPort } from '../../ports/iam/audit-event-writer.port';
import type { AuthorizationDecisionLoggerPort } from '../../ports/iam/authorization-decision-logger.port';
import type { PlatformMembershipRepositoryPort } from '../../ports/iam/platform-membership-repository.port';
import type { TenantMembershipRepositoryPort } from '../../ports/iam/tenant-membership-repository.port';
import {
  AuthorizationError,
  type AuthorizationErrorCode
} from '../../../domain/iam/authorization-errors';
import type { PlatformMembership } from '../../../domain/iam/platform-role';

export class PlatformGovernanceUseCase {
  constructor(
    private readonly platformRepository: PlatformMembershipRepositoryPort,
    private readonly tenantRepository: TenantMembershipRepositoryPort,
    private readonly auditEventWriter: AuditEventWriterPort,
    private readonly decisionLogger: AuthorizationDecisionLoggerPort
  ) {}

  async listTenants(actorUserId: string): Promise<string[]> {
    return this.withDecisionLogging(
      { actorUserId, operation: 'platform.tenant.list' },
      async () => {
        await this.ensureActorIsSuperadmin(actorUserId);
        return this.tenantRepository.listAllTenantIds();
      }
    );
  }

  async listPlatformMembers(actorUserId: string): Promise<PlatformMembership[]> {
    return this.withDecisionLogging(
      { actorUserId, operation: 'platform.members.list' },
      async () => {
        await this.ensureActorIsSuperadmin(actorUserId);
        return this.platformRepository.listAll();
      }
    );
  }

  async assignSuperadmin(
    actorUserId: string,
    targetUserId: string
  ): Promise<PlatformMembership> {
    return this.withDecisionLogging(
      { actorUserId, operation: 'platform.superadmin.assign' },
      async () => {
        await this.ensureActorIsSuperadmin(actorUserId);

        const existing = await this.platformRepository.findByUserId(targetUserId);

        let membership: PlatformMembership;
        if (existing) {
          membership = await this.platformRepository.update(targetUserId, {
            status: 'Active'
          });
        } else {
          membership = await this.platformRepository.create({
            userId: targetUserId,
            role: 'Superadmin',
            status: 'Active'
          });
        }

        await this.auditEventWriter.append({
          id: randomUUID(),
          tenantId: 'platform',
          actorUserId,
          targetUserId,
          action: 'platform.superadmin.assigned',
          metadata: {
            role: 'Superadmin',
            previousStatus: existing?.status ?? null
          },
          occurredAt: new Date(),
          correlationId: randomUUID()
        });

        return membership;
      }
    );
  }

  async revokeSuperadmin(
    actorUserId: string,
    targetUserId: string
  ): Promise<PlatformMembership> {
    return this.withDecisionLogging(
      { actorUserId, operation: 'platform.superadmin.revoke' },
      async () => {
        await this.ensureActorIsSuperadmin(actorUserId);

        if (actorUserId === targetUserId) {
          throw new AuthorizationError(
            'platform.self_revoke_forbidden',
            'A Superadmin cannot revoke their own platform role.'
          );
        }

        const existing = await this.platformRepository.findByUserId(targetUserId);
        if (!existing) {
          throw new AuthorizationError(
            'membership.not_found',
            'Platform membership not found for target user.'
          );
        }

        const membership = await this.platformRepository.update(targetUserId, {
          status: 'Revoked'
        });

        await this.auditEventWriter.append({
          id: randomUUID(),
          tenantId: 'platform',
          actorUserId,
          targetUserId,
          action: 'platform.superadmin.revoked',
          metadata: {
            role: 'Superadmin',
            previousStatus: existing.status
          },
          occurredAt: new Date(),
          correlationId: randomUUID()
        });

        return membership;
      }
    );
  }

  static mapErrorToHttpStatus(code: AuthorizationErrorCode): number {
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

  private async ensureActorIsSuperadmin(actorUserId: string): Promise<void> {
    const membership = await this.platformRepository.findByUserId(actorUserId);
    if (!membership || membership.status !== 'Active') {
      throw new AuthorizationError(
        'platform.access.denied',
        'Actor does not have an active Superadmin platform membership.'
      );
    }
  }

  private async withDecisionLogging<T>(
    context: { actorUserId: string; operation: string },
    fn: () => Promise<T>
  ): Promise<T> {
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
    } catch (error) {
      await this.decisionLogger.record({
        tenantId: 'platform',
        actorUserId: context.actorUserId,
        operation: context.operation,
        decision: 'deny',
        reasonCode: error instanceof AuthorizationError ? error.code : 'unknown',
        occurredAt: new Date()
      });
      throw error;
    }
  }
}
