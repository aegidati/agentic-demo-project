"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const membership_invariants_1 = require("../src/domain/iam/membership-invariants");
(0, vitest_1.describe)('membership invariants', () => {
    (0, vitest_1.it)('accepts allowed lifecycle transitions and rejects invalid ones', () => {
        (0, vitest_1.expect)((0, membership_invariants_1.isAllowedMembershipTransition)('Invited', 'Active')).toBe(true);
        (0, vitest_1.expect)((0, membership_invariants_1.isAllowedMembershipTransition)('Active', 'Suspended')).toBe(true);
        (0, vitest_1.expect)((0, membership_invariants_1.isAllowedMembershipTransition)('Suspended', 'Active')).toBe(true);
        (0, vitest_1.expect)((0, membership_invariants_1.isAllowedMembershipTransition)('Active', 'Revoked')).toBe(true);
        (0, vitest_1.expect)((0, membership_invariants_1.isAllowedMembershipTransition)('Active', 'Invited')).toBe(false);
        (0, vitest_1.expect)((0, membership_invariants_1.isAllowedMembershipTransition)('Revoked', 'Active')).toBe(false);
    });
    (0, vitest_1.it)('detects self-elevation attempts only when role rank increases', () => {
        (0, vitest_1.expect)((0, membership_invariants_1.isSelfElevation)('user-1', 'user-1', 'Admin', 'Owner')).toBe(true);
        (0, vitest_1.expect)((0, membership_invariants_1.isSelfElevation)('user-1', 'user-1', 'Owner', 'Admin')).toBe(false);
        (0, vitest_1.expect)((0, membership_invariants_1.isSelfElevation)('user-1', 'user-2', 'Member', 'Owner')).toBe(false);
        (0, vitest_1.expect)((0, membership_invariants_1.isSelfElevation)('user-1', 'user-1', null, 'Viewer')).toBe(false);
        (0, vitest_1.expect)((0, membership_invariants_1.isSelfElevation)('user-1', 'user-1', null, 'Member')).toBe(true);
    });
    (0, vitest_1.it)('counts only active owners', () => {
        const memberships = [
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
        (0, vitest_1.expect)((0, membership_invariants_1.countActiveOwners)(memberships)).toBe(1);
    });
});
