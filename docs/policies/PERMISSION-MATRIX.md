# Permission Matrix

This matrix defines the starter baseline for tenant-scoped authorization. Derived projects may refine it, but changes should be documented explicitly.

Legend:

- Allow: baseline action permitted
- Conditional: permitted only with additional policy constraints
- Deny: not permitted by baseline

| Permission        | Owner | Admin       | Member | Viewer |
|-------------------|:-----:|:-----------:|:------:|:------:|
| membership:list   | Allow | Allow       | Deny   | Deny   |
| membership:add    | Allow | Allow       | Deny   | Deny   |
| membership:remove | Allow | Conditional | Deny   | Deny   |
| role:assign       | Allow | Conditional | Deny   | Deny   |
| role:revoke       | Allow | Conditional | Deny   | Deny   |
| resource:read     | Allow | Allow       | Allow  | Allow  |
| resource:write    | Allow | Allow       | Allow  | Deny   |
| resource:delete   | Allow | Allow       | Deny   | Deny   |
| tenant:settings   | Allow | Allow       | Deny   | Deny   |

## Special Constraints

- Admin cannot assign Owner or Admin unless a future policy explicitly allows it.
- Admin cannot remove Owner.
- Self-elevation to a higher TenantRole is forbidden.
- Last-owner protection must be explicitly decided by ADR.

## Interpretation Notes

- Conditional means the action is not generally open-ended and requires extra policy checks.
- Owner is the only baseline role assumed to manage all listed administrative actions without further role restrictions.
- Admin is intentionally constrained to avoid implicit escalation into ownership governance.
- Member and Viewer focus on resource access, not tenant governance.
