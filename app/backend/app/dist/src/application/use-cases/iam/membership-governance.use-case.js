"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipGovernanceUseCase = void 0;
const authorization_errors_1 = require("../../../domain/iam/authorization-errors");
const membership_invariants_1 = require("../../../domain/iam/membership-invariants");
class MembershipGovernanceUseCase {
    repository;
    globalUserStatusReader;
    constructor(repository, globalUserStatusReader) {
        this.repository = repository;
        this.globalUserStatusReader = globalUserStatusReader;
    }
    async list(tenantId, actorUserId) {
        await this.ensureActorIsActiveMember({ actorUserId, tenantId });
        return this.repository.listByTenantId(tenantId);
    }
    async get(tenantId, actorUserId, userId) {
        await this.ensureActorIsActiveMember({ actorUserId, tenantId });
        return this.getExistingMembership(tenantId, userId);
    }
    async create(tenantId, actorUserId, userId, role, status) {
        return this.repository.withTenantLock(tenantId, async () => {
            const actorMembership = await this.ensureActorCanMutate({ actorUserId, tenantId });
            if ((0, membership_invariants_1.isSelfElevation)(actorUserId, userId, actorMembership.role, role)) {
                throw new authorization_errors_1.AuthorizationError('membership.self_elevation', 'Self elevation to higher privilege is forbidden.');
            }
            const existing = await this.repository.findByIdentity({ tenantId, userId });
            if (existing) {
                throw new authorization_errors_1.AuthorizationError('membership.invalid_transition', 'Membership already exists.');
            }
            return this.repository.create({ tenantId, userId, role, status });
        });
    }
    async updateStatus(tenantId, actorUserId, userId, status) {
        return this.repository.withTenantLock(tenantId, async () => {
            await this.ensureActorCanMutate({ actorUserId, tenantId });
            const membership = await this.getExistingMembership(tenantId, userId);
            if (!(0, membership_invariants_1.isAllowedMembershipTransition)(membership.status, status)) {
                throw new authorization_errors_1.AuthorizationError('membership.invalid_transition', `Transition ${membership.status} -> ${status} is not allowed.`);
            }
            if (membership.role === 'Owner' && membership.status === 'Active' && status !== 'Active') {
                await this.ensureLastOwnerInvariant(tenantId, membership.userId);
            }
            return this.repository.update({ tenantId, userId }, { status });
        });
    }
    async updateRole(tenantId, actorUserId, userId, role) {
        return this.repository.withTenantLock(tenantId, async () => {
            const actorMembership = await this.ensureActorCanMutate({ actorUserId, tenantId });
            const membership = await this.getExistingMembership(tenantId, userId);
            if ((0, membership_invariants_1.isSelfElevation)(actorUserId, userId, membership.role, role)) {
                throw new authorization_errors_1.AuthorizationError('membership.self_elevation', 'Self elevation to higher privilege is forbidden.');
            }
            if (membership.role === 'Owner' && role !== 'Owner' && membership.status === 'Active') {
                await this.ensureLastOwnerInvariant(tenantId, membership.userId);
            }
            if (actorMembership.role !== 'Owner' && role === 'Owner') {
                throw new authorization_errors_1.AuthorizationError('auth.forbidden', 'Only owner can assign owner role in baseline policy.');
            }
            return this.repository.update({ tenantId, userId }, { role });
        });
    }
    async delete(tenantId, actorUserId, userId) {
        await this.repository.withTenantLock(tenantId, async () => {
            await this.ensureActorCanMutate({ actorUserId, tenantId });
            const membership = await this.getExistingMembership(tenantId, userId);
            if (membership.role === 'Owner' && membership.status === 'Active') {
                await this.ensureLastOwnerInvariant(tenantId, membership.userId);
            }
            await this.repository.delete({ tenantId, userId });
        });
    }
    static mapErrorToHttpStatus(code) {
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
    async ensureActorIsActiveMember(context) {
        await this.ensureGlobalUserIsAuthorized(context.actorUserId);
        const actorMembership = await this.repository.findByIdentity({
            tenantId: context.tenantId,
            userId: context.actorUserId
        });
        if (!actorMembership || actorMembership.status !== 'Active') {
            throw new authorization_errors_1.AuthorizationError('auth.forbidden', 'Actor must be an active tenant member for this operation.');
        }
        return actorMembership;
    }
    async ensureGlobalUserIsAuthorized(userId) {
        const profile = await this.globalUserStatusReader.getByUserId(userId);
        if (!profile || profile.globalStatus !== 'Active') {
            throw new authorization_errors_1.AuthorizationError('auth.global_user_blocked', 'Global user status is not authorized for tenant-scoped access.');
        }
    }
    async ensureActorCanMutate(context) {
        const actorMembership = await this.ensureActorIsActiveMember(context);
        if (actorMembership.role !== 'Owner' && actorMembership.role !== 'Admin') {
            throw new authorization_errors_1.AuthorizationError('auth.forbidden', 'Actor role is not allowed to mutate tenant memberships.');
        }
        return actorMembership;
    }
    async getExistingMembership(tenantId, userId) {
        const membership = await this.repository.findByIdentity({ tenantId, userId });
        if (!membership) {
            throw new authorization_errors_1.AuthorizationError('membership.not_found', 'Tenant membership not found in accessible scope.');
        }
        return membership;
    }
    async ensureLastOwnerInvariant(tenantId, candidateOwnerUserId) {
        const tenantMemberships = await this.repository.listByTenantId(tenantId);
        const activeOwners = (0, membership_invariants_1.countActiveOwners)(tenantMemberships);
        const candidate = tenantMemberships.find((m) => m.userId === candidateOwnerUserId && m.role === 'Owner' && m.status === 'Active');
        if (candidate && activeOwners <= 1) {
            throw new authorization_errors_1.AuthorizationError('membership.last_owner_protection', 'Removing or demoting the last active owner is forbidden.');
        }
    }
}
exports.MembershipGovernanceUseCase = MembershipGovernanceUseCase;
