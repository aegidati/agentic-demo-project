export type AuthorizationErrorCode =
  | 'auth.missing_actor'
  | 'auth.global_user_blocked'
  | 'auth.tenant_context_conflict'
  | 'auth.forbidden'
  | 'membership.not_found'
  | 'membership.invalid_transition'
  | 'membership.last_owner_protection'
  | 'membership.self_elevation'
  | 'request.invalid_payload';

export class AuthorizationError extends Error {
  constructor(
    public readonly code: AuthorizationErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}
