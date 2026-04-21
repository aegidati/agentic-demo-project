import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { MembershipGovernanceUseCase } from '../../../application/use-cases/iam/membership-governance.use-case';
import type { TenantContextResolverPort } from '../../../application/ports/iam/tenant-context-resolver.port';
import {
  AuthorizationError,
  type AuthorizationErrorCode
} from '../../../domain/iam/authorization-errors';
import type {
  MembershipStatus,
  TenantRole
} from '../../../domain/iam/tenant-membership';

interface IamRoutesDependencies {
  membershipGovernanceUseCase: MembershipGovernanceUseCase;
  tenantContextResolver: TenantContextResolverPort;
}

interface TenantParams {
  tenantId: string;
}

interface TenantUserParams extends TenantParams {
  userId: string;
}

interface CreateMembershipBody {
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
}

interface UpdateMembershipStatusBody {
  status: MembershipStatus;
}

interface UpdateMembershipRoleBody {
  role: TenantRole;
}

function getActorUserId(request: FastifyRequest): string {
  const actorUserIdHeader = request.headers['x-actor-user-id'];
  const actorUserId = Array.isArray(actorUserIdHeader)
    ? actorUserIdHeader[0]
    : actorUserIdHeader;
  if (!actorUserId) {
    throw new AuthorizationError('auth.missing_actor', 'Missing x-actor-user-id header.');
  }

  return actorUserId;
}

function parseTenantHeader(request: FastifyRequest): string | undefined {
  const headerValue = request.headers['x-tenant-id'];
  return Array.isArray(headerValue) ? headerValue[0] : headerValue;
}

function isMembershipStatus(value: unknown): value is MembershipStatus {
  return value === 'Invited' || value === 'Active' || value === 'Suspended' || value === 'Revoked';
}

function isTenantRole(value: unknown): value is TenantRole {
  return value === 'Owner' || value === 'Admin' || value === 'Member' || value === 'Viewer';
}

function buildProblem(status: number, code: AuthorizationErrorCode, detail: string): Record<string, unknown> {
  return {
    type: 'about:blank',
    title: status >= 500 ? 'Internal Server Error' : 'Request Failed',
    status,
    errorCode: code,
    detail,
    traceId: `trace-${Date.now()}`
  };
}

function handleError(error: unknown, reply: FastifyReply): FastifyReply {
  if (error instanceof AuthorizationError) {
    const status = MembershipGovernanceUseCase.mapErrorToHttpStatus(error.code);
    return reply.status(status).send(buildProblem(status, error.code, error.message));
  }

  return reply.status(500).send(buildProblem(500, 'request.invalid_payload', 'Unexpected error'));
}

export function registerIamMembershipRoutes(
  app: FastifyInstance,
  dependencies: IamRoutesDependencies
): void {
  app.get<{ Params: TenantParams }>('/tenants/:tenantId/memberships', async (request, reply) => {
    try {
      const actorUserId = getActorUserId(request);
      const tenantId = dependencies.tenantContextResolver.resolve({
        pathTenantId: request.params.tenantId,
        headerTenantId: parseTenantHeader(request)
      });

      const items = await dependencies.membershipGovernanceUseCase.list(tenantId, actorUserId);
      return reply.send({ items, total: items.length });
    } catch (error) {
      return handleError(error, reply);
    }
  });

  app.get<{ Params: TenantUserParams }>(
    '/tenants/:tenantId/memberships/:userId',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);
        const tenantId = dependencies.tenantContextResolver.resolve({
          pathTenantId: request.params.tenantId,
          headerTenantId: parseTenantHeader(request)
        });

        const membership = await dependencies.membershipGovernanceUseCase.get(
          tenantId,
          actorUserId,
          request.params.userId
        );

        return reply.send(membership);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.post<{ Params: TenantParams; Body: CreateMembershipBody }>(
    '/tenants/:tenantId/memberships',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);
        const tenantId = dependencies.tenantContextResolver.resolve({
          pathTenantId: request.params.tenantId,
          headerTenantId: parseTenantHeader(request)
        });

        if (!request.body || !isTenantRole(request.body.role) || !isMembershipStatus(request.body.status)) {
          throw new AuthorizationError('request.invalid_payload', 'Invalid create membership payload.');
        }

        const created = await dependencies.membershipGovernanceUseCase.create(
          tenantId,
          actorUserId,
          request.body.userId,
          request.body.role,
          request.body.status
        );

        return reply.status(201).send(created);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.patch<{ Params: TenantUserParams; Body: UpdateMembershipStatusBody }>(
    '/tenants/:tenantId/memberships/:userId/status',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);
        const tenantId = dependencies.tenantContextResolver.resolve({
          pathTenantId: request.params.tenantId,
          headerTenantId: parseTenantHeader(request)
        });

        if (!request.body || !isMembershipStatus(request.body.status)) {
          throw new AuthorizationError('request.invalid_payload', 'Invalid membership status payload.');
        }

        const updated = await dependencies.membershipGovernanceUseCase.updateStatus(
          tenantId,
          actorUserId,
          request.params.userId,
          request.body.status
        );

        return reply.send(updated);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.patch<{ Params: TenantUserParams; Body: UpdateMembershipRoleBody }>(
    '/tenants/:tenantId/memberships/:userId/role',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);
        const tenantId = dependencies.tenantContextResolver.resolve({
          pathTenantId: request.params.tenantId,
          headerTenantId: parseTenantHeader(request)
        });

        if (!request.body || !isTenantRole(request.body.role)) {
          throw new AuthorizationError('request.invalid_payload', 'Invalid membership role payload.');
        }

        const updated = await dependencies.membershipGovernanceUseCase.updateRole(
          tenantId,
          actorUserId,
          request.params.userId,
          request.body.role
        );

        return reply.send(updated);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.delete<{ Params: TenantUserParams }>(
    '/tenants/:tenantId/memberships/:userId',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);
        const tenantId = dependencies.tenantContextResolver.resolve({
          pathTenantId: request.params.tenantId,
          headerTenantId: parseTenantHeader(request)
        });

        await dependencies.membershipGovernanceUseCase.delete(
          tenantId,
          actorUserId,
          request.params.userId
        );
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
