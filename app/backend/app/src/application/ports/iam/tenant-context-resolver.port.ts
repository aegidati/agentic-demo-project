export interface ResolveTenantContextInput {
  pathTenantId: string;
  headerTenantId?: string;
}

export interface TenantContextResolverPort {
  resolve(input: ResolveTenantContextInput): string;
}
