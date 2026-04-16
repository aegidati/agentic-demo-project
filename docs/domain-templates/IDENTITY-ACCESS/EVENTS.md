# Identity & Access Domain Events

This document describes architecture-agnostic, business-oriented event sequences. The sequences describe what happens in the domain, not how messages are transported or stored.

## Add Member To Tenant

1. A privileged actor chooses a Tenant and identifies the target User.
2. The domain verifies that the actor is allowed to add membership within that Tenant.
3. The domain creates or activates the TenantMembership for the User in that Tenant.
4. An initial TenantRole is associated with that TenantMembership.
5. An AuditEvent is recorded for the membership addition.
6. Business observers may react to UserAddedToTenant and TenantRoleAssigned.

Common events:

- UserAddedToTenant
- TenantMembershipActivated
- TenantRoleAssigned
- AuditEventRecorded

## Revoke Tenant Role

1. A privileged actor selects the TenantMembership within the current Tenant.
2. The domain verifies that the actor is allowed to revoke the target TenantRole.
3. The domain removes the relevant TenantRole from that TenantMembership.
4. The domain reevaluates the resulting authorization posture for the affected User in that Tenant.
5. An AuditEvent is recorded for the role change.

Common events:

- TenantRoleRevoked
- AuditEventRecorded

## Remove Membership

1. A privileged actor selects the TenantMembership to remove.
2. The domain verifies that removal is allowed under current governance rules.
3. The domain ends or deactivates the TenantMembership.
4. The affected User no longer authorizes actions for that Tenant unless a new valid TenantMembership is established.
5. An AuditEvent is recorded for the removal.

Common events:

- TenantMembershipRemoved
- AuditEventRecorded

## Transfer Ownership

1. A current authorized actor initiates ownership transfer within a Tenant.
2. The domain verifies that the transfer is allowed and does not violate the selected last-owner protection policy.
3. The target TenantMembership receives the Owner TenantRole according to the chosen flow.
4. The former owner loses exclusive ownership status according to the chosen flow.
5. The domain records the ownership transition as an AuditEvent.

Common events:

- TenantOwnershipTransferred
- TenantRoleAssigned
- TenantRoleRevoked
- AuditEventRecorded
