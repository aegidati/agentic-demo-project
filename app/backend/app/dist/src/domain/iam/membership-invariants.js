"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedMembershipTransition = isAllowedMembershipTransition;
exports.isSelfElevation = isSelfElevation;
exports.countActiveOwners = countActiveOwners;
const allowedTransitions = {
    Invited: ['Active', 'Revoked'],
    Active: ['Suspended', 'Revoked'],
    Suspended: ['Active'],
    Revoked: []
};
const roleRank = {
    Viewer: 1,
    Member: 2,
    Admin: 3,
    Owner: 4
};
function isAllowedMembershipTransition(from, to) {
    return allowedTransitions[from].includes(to);
}
function isSelfElevation(actorUserId, targetUserId, currentRole, requestedRole) {
    if (actorUserId !== targetUserId) {
        return false;
    }
    if (!currentRole) {
        return roleRank[requestedRole] > roleRank.Viewer;
    }
    return roleRank[requestedRole] > roleRank[currentRole];
}
function countActiveOwners(memberships) {
    return memberships.filter((m) => m.status === 'Active' && m.role === 'Owner').length;
}
