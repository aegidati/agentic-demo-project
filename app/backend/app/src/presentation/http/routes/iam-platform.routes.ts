import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PlatformGovernanceUseCase } from '../../../application/use-cases/iam/platform-governance.use-case';
import {
  AuthorizationError,
  type AuthorizationErrorCode
} from '../../../domain/iam/authorization-errors';

interface IamPlatformRoutesDependencies {
  platformGovernanceUseCase: PlatformGovernanceUseCase;
}

interface PlatformUserParams {
  userId: string;
}

interface AssignSuperadminBody {
  userId: string;
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

function buildProblem(
  status: number,
  code: AuthorizationErrorCode,
  detail: string
): Record<string, unknown> {
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
    const status = PlatformGovernanceUseCase.mapErrorToHttpStatus(error.code);
    return reply.status(status).send(buildProblem(status, error.code, error.message));
  }

  return reply.status(500).send(buildProblem(500, 'request.invalid_payload', 'Unexpected error'));
}

export function registerIamPlatformRoutes(
  app: FastifyInstance,
  dependencies: IamPlatformRoutesDependencies
): void {
  app.get('/platform/memberships', async (request, reply) => {
    try {
      const actorUserId = getActorUserId(request);
      const members = await dependencies.platformGovernanceUseCase.listPlatformMembers(actorUserId);
      return reply.send({ items: members, total: members.length });
    } catch (error) {
      return handleError(error, reply);
    }
  });

  app.post<{ Body: AssignSuperadminBody }>(
    '/platform/memberships',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);

        if (!request.body || typeof request.body.userId !== 'string' || !request.body.userId) {
          throw new AuthorizationError('request.invalid_payload', 'Missing or invalid userId in request body.');
        }

        const membership = await dependencies.platformGovernanceUseCase.assignSuperadmin(
          actorUserId,
          request.body.userId
        );

        return reply.status(201).send(membership);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.delete<{ Params: PlatformUserParams }>(
    '/platform/memberships/:userId',
    async (request, reply) => {
      try {
        const actorUserId = getActorUserId(request);
        const membership = await dependencies.platformGovernanceUseCase.revokeSuperadmin(
          actorUserId,
          request.params.userId
        );

        return reply.send(membership);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.get('/platform/tenants', async (request, reply) => {
    try {
      const actorUserId = getActorUserId(request);
      const tenantIds = await dependencies.platformGovernanceUseCase.listTenants(actorUserId);
      return reply.send({ items: tenantIds, total: tenantIds.length });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}
