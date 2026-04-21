import { randomUUID } from 'node:crypto';
import type { AuditEventWriterPort } from '../../ports/iam/audit-event-writer.port';
import type { AuthorizationDecisionLoggerPort } from '../../ports/iam/authorization-decision-logger.port';
import type { GlobalUserStatusReaderPort } from '../../ports/iam/global-user-status-reader.port';
import type { TenantMembershipRepositoryPort } from '../../ports/iam/tenant-membership-repository.port';
import {
  AuthorizationError,
  type AuthorizationErrorCode
} from '../../../domain/iam/authorization-errors';
import type { GovernanceAction } from '../../../domain/iam/audit-event';
import {
  countActiveOwners,
  isAllowedMembershipTransition,
  isSelfElevation
} from '../../../domain/iam/membership-invariants';
import type {
  MembershipStatus,
  TenantMembership,
  TenantRole
} from '../../../domain/iam/tenant-membership';

interface ActorContext {
  actorUserId: string;
  tenantId: string;
}

export class MembershipGovernanceUseCase {
  constructor(
    private readonly repository: TenantMembershipRepositoryPort,
    private readonly globalUserStatusReader: GlobalUserStatusReaderPort,
    private readonly auditEventWriter: AuditEventWriterPort,
    private readonly decisionLogger: AuthorizationDecisionLoggerPort
  ) {}

  async list(tenantId: string, actorUserId: string): Promise<TenantMembership[]> {
    return this.withDecisionLogging({ actorUserId, tenantId, operation: 'membership.list' }, async () => {
      await this.ensureActorIsActiveMember({ actorUserId, tenantId });
      return this.repository.listByTenantId(tenantId);
    });
  }

  async get(tenantId: string, actorUserId: string, userId: string): Promise<TenantMembership> {
    return this.withDecisionLogging({ actorUserId, tenantId, operation: 'membership.get' }, async () => {
      await this.ensureActorIsActiveMember({ actorUserId, tenantId });
      return this.getExistingMembership(tenantId, userId);
    });
  }

  async create(
    tenantId: string,
    actorUserId: string,
    userId: string,
    role: TenantRole,
    status: MembershipStatus
  ): Promise<TenantMembership> {
    return this.withDecisionLogging({ actorUserId, tenantId, operation: 'membership.create' }, async () => {
      return this.repository.withTenantLock(tenantId, async () => {
        const actorMembership = await this.ensureActorCanMutate({ actorUserId, tenantId });

        if (isSelfElevation(actorUserId, userId, actorMembership.role, role)) {
          throw new AuthorizationError(
            'membership.self_elevation',
            'Self elevation to higher privilege is forbidden.'
          );
        }

        const existing = await this.repository.findByIdentity({ tenantId, userId });
        if (existing) {
          throw new AuthorizationError('membership.invalid_transition', 'Membership already exists.');
        }

        const created = await this.repository.create({ tenantId, userId, role, status });
        return this.withAuditedMutation(
          async () => created,
          () => this.repository.delete({ tenantId, userId }),
          {
            tenantId,
            actorUserId,
            targetUserId: userId,
            action: 'membership.created',
            metadata: {
              role: created.role,
              status: created.status
            }
          }
        );
      });
    });
  }

  async updateStatus(
    tenantId: string,
    actorUserId: string,
    userId: string,
    status: MembershipStatus
  ): Promise<TenantMembership> {
    return this.withDecisionLogging(
      { actorUserId, tenantId, operation: 'membership.status.update' },
      async () => {
        return this.repository.withTenantLock(tenantId, async () => {
          await this.ensureActorCanMutate({ actorUserId, tenantId });
          const membership = await this.getExistingMembership(tenantId, userId);

          if (!isAllowedMembershipTransition(membership.status, status)) {
            throw new AuthorizationError(
              'membership.invalid_transition',
              `Transition ${membership.status} -> ${status} is not allowed.`
            );
          }

          if (membership.role === 'Owner' && membership.status === 'Active' && status !== 'Active') {
            await this.ensureLastOwnerInvariant(tenantId, membership.userId);
          }

          const updated = await this.repository.update({ tenantId, userId }, { status });
          return this.withAuditedMutation(
            async () => updated,
            () =>
              this.repository
                .update({ tenantId, userId }, { status: membership.status })
                .then(() => undefined),
            {
              tenantId,
              actorUserId,
              targetUserId: userId,
              action: 'membership.status.updated',
              metadata: {
                previousStatus: membership.status,
                status: updated.status
              }
            }
          );
        });
      }
    );
  }

  async updateRole(
    tenantId: string,
    actorUserId: string,
    userId: string,
    role: TenantRole
  ): Promise<TenantMembership> {
    return this.withDecisionLogging({ actorUserId, tenantId, operation: 'membership.role.update' }, async () => {
      return this.repository.withTenantLock(tenantId, async () => {
        const actorMembership = await this.ensureActorCanMutate({ actorUserId, tenantId });
        const membership = await this.getExistingMembership(tenantId, userId);

        if (isSelfElevation(actorUserId, userId, membership.role, role)) {
          throw new AuthorizationError(
            'membership.self_elevation',
            'Self elevation to higher privilege is forbidden.'
          );
        }

        if (membership.role === 'Owner' && role !== 'Owner' && membership.status === 'Active') {
          await this.ensureLastOwnerInvariant(tenantId, membership.userId);
        }

        if (actorMembership.role !== 'Owner' && role === 'Owner') {
          throw new AuthorizationError(
            'auth.forbidden',
            'Only owner can assign owner role in baseline policy.'
          );
        }

        const updated = await this.repository.update({ tenantId, userId }, { role });
        return this.withAuditedMutation(
          async () => updated,
          () =>
            this.repository
              .update({ tenantId, userId }, { role: membership.role })
              .then(() => undefined),
          {
            tenantId,
            actorUserId,
            targetUserId: userId,
            action: 'membership.role.updated',
            metadata: {
              previousRole: membership.role,
              role: updated.role
            }
          }
        );
      });
    });
  }

  async delete(tenantId: string, actorUserId: string, userId: string): Promise<void> {
    await this.withDecisionLogging({ actorUserId, tenantId, operation: 'membership.delete' }, async () => {
      await this.repository.withTenantLock(tenantId, async () => {
        await this.ensureActorCanMutate({ actorUserId, tenantId });
        const membership = await this.getExistingMembership(tenantId, userId);

        if (membership.role === 'Owner' && membership.status === 'Active') {
          await this.ensureLastOwnerInvariant(tenantId, membership.userId);
        }

        await this.repository.delete({ tenantId, userId });
        await this.withAuditedMutation(
          async () => undefined,
          () =>
            this.repository.create({
              tenantId: membership.tenantId,
              userId: membership.userId,
              role: membership.role,
              status: membership.status
            }).then(() => undefined),
          {
            tenantId,
            actorUserId,
            targetUserId: userId,
            action: 'membership.deleted',
            metadata: {
              previousRole: membership.role,
              previousStatus: membership.status
            }
          }
        );
      });
    });
  }

  static mapErrorToHttpStatus(code: AuthorizationErrorCode): number {
    switch (code) {
      case 'auth.missing_actor':
        return 401;
      case 'auth.global_user_blocked':
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

  private async ensureActorIsActiveMember(context: ActorContext): Promise<TenantMembership> {
    await this.ensureGlobalUserIsAuthorized(context.actorUserId);

    const actorMembership = await this.repository.findByIdentity({
      tenantId: context.tenantId,
      userId: context.actorUserId
    });

    if (!actorMembership || actorMembership.status !== 'Active') {
      throw new AuthorizationError(
        'auth.forbidden',
        'Actor must be an active tenant member for this operation.'
      );
    }

    return actorMembership;
  }

  private async ensureGlobalUserIsAuthorized(userId: string): Promise<void> {
    const profile = await this.globalUserStatusReader.getByUserId(userId);

    if (!profile || profile.globalStatus !== 'Active') {
      throw new AuthorizationError(
        'auth.global_user_blocked',
        'Global user status is not authorized for tenant-scoped access.'
      );
    }
  }

  private async ensureActorCanMutate(context: ActorContext): Promise<TenantMembership> {
    const actorMembership = await this.ensureActorIsActiveMember(context);
    if (actorMembership.role !== 'Owner' && actorMembership.role !== 'Admin') {
      throw new AuthorizationError(
        'auth.forbidden',
        'Actor role is not allowed to mutate tenant memberships.'
      );
    }

    return actorMembership;
  }

  private async getExistingMembership(
    tenantId: string,
    userId: string
  ): Promise<TenantMembership> {
    const membership = await this.repository.findByIdentity({ tenantId, userId });
    if (!membership) {
      throw new AuthorizationError(
        'membership.not_found',
        'Tenant membership not found in accessible scope.'
      );
    }

    return membership;
  }

  private async ensureLastOwnerInvariant(
    tenantId: string,
    candidateOwnerUserId: string
  ): Promise<void> {
    const tenantMemberships = await this.repository.listByTenantId(tenantId);
    const activeOwners = countActiveOwners(tenantMemberships);
    const candidate = tenantMemberships.find(
      (m) => m.userId === candidateOwnerUserId && m.role === 'Owner' && m.status === 'Active'
    );

    if (candidate && activeOwners <= 1) {
      throw new AuthorizationError(
        'membership.last_owner_protection',
        'Removing or demoting the last active owner is forbidden.'
      );
    }
  }

  private async appendAuditEvent(
    tenantId: string,
    actorUserId: string,
    targetUserId: string,
    action: GovernanceAction,
    metadata: Record<string, unknown>
  ): Promise<void> {
    await this.auditEventWriter.append({
      id: randomUUID(),
      tenantId,
      actorUserId,
      targetUserId,
      action,
      metadata,
      occurredAt: new Date(),
      correlationId: randomUUID()
    });
  }

  private async withAuditedMutation<T>(
    commitResult: () => Promise<T>,
    compensate: () => Promise<void>,
    audit: {
      tenantId: string;
      actorUserId: string;
      targetUserId: string;
      action: GovernanceAction;
      metadata: Record<string, unknown>;
    }
  ): Promise<T> {
    try {
      const result = await commitResult();
      await this.appendAuditEvent(
        audit.tenantId,
        audit.actorUserId,
        audit.targetUserId,
        audit.action,
        audit.metadata
      );
      return result;
    } catch (error) {
      if (!(error instanceof AuthorizationError)) {
        await compensate();
      }

      throw error;
    }
  }

  private async withDecisionLogging<T>(
    context: ActorContext & { operation: string },
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await operation();
      await this.decisionLogger.record({
        tenantId: context.tenantId,
        actorUserId: context.actorUserId,
        operation: context.operation,
        decision: 'allow',
        occurredAt: new Date()
      });
      return result;
    } catch (error) {
      if (error instanceof AuthorizationError) {
        await this.decisionLogger.record({
          tenantId: context.tenantId,
          actorUserId: context.actorUserId,
          operation: context.operation,
          decision: 'deny',
          reasonCode: error.code,
          occurredAt: new Date()
        });
      }

      throw error;
    }
  }
}
