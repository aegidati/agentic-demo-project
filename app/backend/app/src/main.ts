import Fastify, { type FastifyInstance } from 'fastify';
import { GetHealthStatusUseCase } from './application/use-cases/get-health-status.use-case';
import { InMemoryHealthCheckAdapter } from './infrastructure/health/in-memory-health-check.adapter';
import { registerHealthRoutes } from './presentation/http/routes/health.routes';

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  const healthCheckAdapter = new InMemoryHealthCheckAdapter();
  const getHealthStatusUseCase = new GetHealthStatusUseCase(healthCheckAdapter);

  registerHealthRoutes(app, { getHealthStatusUseCase });

  return app;
}

export async function startServer(): Promise<void> {
  const app = buildApp();
  const host = process.env.HOST ?? '0.0.0.0';
  const port = Number(process.env.PORT ?? 3000);

  await app.listen({ host, port });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
