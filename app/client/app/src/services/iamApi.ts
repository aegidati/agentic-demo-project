export type TenantRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';
export type MembershipStatus = 'Invited' | 'Active' | 'Suspended' | 'Revoked';

export interface TenantMembership {
  tenantId: string;
  userId: string;
  role: TenantRole;
  status: MembershipStatus;
}

interface MembershipListResponse {
  items: TenantMembership[];
  total: number;
}

interface ProblemResponse {
  errorCode?: string;
  detail?: string;
}

export class MobileApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly errorCode: string | undefined,
    message: string
  ) {
    super(message);
    this.name = 'MobileApiError';
  }
}

function getApiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
  const base = configured && configured.length > 0 ? configured : 'http://localhost:3000';
  return base.replace(/\/$/, '');
}

async function parseProblem(response: Response): Promise<ProblemResponse> {
  try {
    return (await response.json()) as ProblemResponse;
  } catch {
    return {};
  }
}

async function assertOk(response: Response, message: string): Promise<void> {
  if (response.ok) {
    return;
  }

  const problem = await parseProblem(response);
  throw new MobileApiError(response.status, problem.errorCode, problem.detail ?? message);
}

export async function listMemberships(input: {
  tenantId: string;
  actorUserId: string;
}): Promise<MembershipListResponse> {
  const response = await fetch(`${getApiBaseUrl()}/tenants/${input.tenantId}/memberships`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-actor-user-id': input.actorUserId,
      'x-tenant-id': input.tenantId
    }
  });

  await assertOk(response, 'Unable to load memberships.');
  return (await response.json()) as MembershipListResponse;
}

export async function updateMembershipStatus(input: {
  tenantId: string;
  actorUserId: string;
  userId: string;
  status: MembershipStatus;
}): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/tenants/${input.tenantId}/memberships/${input.userId}/status`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-actor-user-id': input.actorUserId,
        'x-tenant-id': input.tenantId
      },
      body: JSON.stringify({ status: input.status })
    }
  );

  await assertOk(response, 'Unable to update status.');
}

export async function updateMembershipRole(input: {
  tenantId: string;
  actorUserId: string;
  userId: string;
  role: TenantRole;
}): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/tenants/${input.tenantId}/memberships/${input.userId}/role`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-actor-user-id': input.actorUserId,
        'x-tenant-id': input.tenantId
      },
      body: JSON.stringify({ role: input.role })
    }
  );

  await assertOk(response, 'Unable to update role.');
}

export function mapMobileIamError(error: unknown): string {
  if (!(error instanceof MobileApiError)) {
    return 'Unexpected mobile IAM error.';
  }

  if (error.status === 403) {
    return error.errorCode === 'auth.global_user_blocked'
      ? 'Access denied: global status blocked.'
      : 'Access denied for selected tenant context.';
  }

  if (error.status === 409) {
    return 'Conflict: invariant violation from IAM API.';
  }

  return error.message;
}
