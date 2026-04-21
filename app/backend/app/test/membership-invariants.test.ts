import { describe, expect, it } from 'vitest';
import {
  countActiveOwners,
  isAllowedMembershipTransition,
  isSelfElevation
} from '../src/domain/iam/membership-invariants';
import type { TenantMembership } from '../src/domain/iam/tenant-membership';

describe('membership invariants', () => {
  it('accepts allowed lifecycle transitions and rejects invalid ones', () => {
    expect(isAllowedMembershipTransition('Invited', 'Active')).toBe(true);
    expect(isAllowedMembershipTransition('Active', 'Suspended')).toBe(true);
    expect(isAllowedMembershipTransition('Suspended', 'Active')).toBe(true);
    expect(isAllowedMembershipTransition('Active', 'Revoked')).toBe(true);

    expect(isAllowedMembershipTransition('Active', 'Invited')).toBe(false);
    expect(isAllowedMembershipTransition('Revoked', 'Active')).toBe(false);
  });

  it('detects self-elevation attempts only when role rank increases', () => {
    expect(isSelfElevation('user-1', 'user-1', 'Admin', 'Owner')).toBe(true);
    expect(isSelfElevation('user-1', 'user-1', 'Owner', 'Admin')).toBe(false);
    expect(isSelfElevation('user-1', 'user-2', 'Member', 'Owner')).toBe(false);
    expect(isSelfElevation('user-1', 'user-1', null, 'Viewer')).toBe(false);
    expect(isSelfElevation('user-1', 'user-1', null, 'Member')).toBe(true);
  });

  it('counts only active owners', () => {
    const memberships: TenantMembership[] = [
      {
        tenantId: 'tenant-001',
        userId: 'owner-1',
        role: 'Owner',
        status: 'Active',
        createdAt: new Date('2026-04-21T08:00:00.000Z'),
        updatedAt: new Date('2026-04-21T08:00:00.000Z')
      },
      {
        tenantId: 'tenant-001',
        userId: 'owner-2',
        role: 'Owner',
        status: 'Suspended',
        createdAt: new Date('2026-04-21T08:00:00.000Z'),
        updatedAt: new Date('2026-04-21T08:00:00.000Z')
      },
      {
        tenantId: 'tenant-001',
        userId: 'admin-1',
        role: 'Admin',
        status: 'Active',
        createdAt: new Date('2026-04-21T08:00:00.000Z'),
        updatedAt: new Date('2026-04-21T08:00:00.000Z')
      }
    ];

    expect(countActiveOwners(memberships)).toBe(1);
  });
});
