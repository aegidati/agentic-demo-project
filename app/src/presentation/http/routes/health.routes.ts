import type { FastifyInstance } from 'fastify';
import type { GetHealthStatusUseCase } from '../../../application/use-cases/get-health-status.use-case';

interface HealthRoutesDependencies {
  getHealthStatusUseCase: GetHealthStatusUseCase;
}

export function registerHealthRoutes(
  app: FastifyInstance,
  dependencies: HealthRoutesDependencies
): void {
  app.get('/health', async () => dependencies.getHealthStatusUseCase.execute());
}
