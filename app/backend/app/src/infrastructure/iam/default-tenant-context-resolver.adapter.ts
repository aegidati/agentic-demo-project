import type {
  ResolveTenantContextInput,
  TenantContextResolverPort
} from '../../application/ports/iam/tenant-context-resolver.port';
import { AuthorizationError } from '../../domain/iam/authorization-errors';

export class DefaultTenantContextResolverAdapter implements TenantContextResolverPort {
  resolve(input: ResolveTenantContextInput): string {
    const { pathTenantId, headerTenantId } = input;

    if (!pathTenantId) {
      throw new AuthorizationError(
        'auth.forbidden',
        'Tenant context is required for tenant-scoped operations.'
      );
    }

    if (headerTenantId && headerTenantId !== pathTenantId) {
      throw new AuthorizationError(
        'auth.tenant_context_conflict',
        'Header tenant context conflicts with route tenant context.'
      );
    }

    return pathTenantId;
  }
}
