import { mapMobileIamError, MobileApiError } from '../src/services/iamApi';

describe('mapMobileIamError', () => {
  it('maps forbidden and conflict IAM errors deterministically', () => {
    const forbidden = mapMobileIamError(
      new MobileApiError(403, 'auth.global_user_blocked', 'forbidden')
    );
    expect(forbidden).toBe('Access denied: global status blocked.');

    const conflict = mapMobileIamError(
      new MobileApiError(409, 'membership.last_owner_protection', 'conflict')
    );
    expect(conflict).toBe('Conflict: invariant violation from IAM API.');
  });
});
