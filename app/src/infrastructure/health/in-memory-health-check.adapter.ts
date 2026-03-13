import type { HealthStatus } from '../../domain/health-status';
import type { HealthCheckPort } from '../../application/ports/health-check.port';

export class InMemoryHealthCheckAdapter implements HealthCheckPort {
  async getStatus(): Promise<HealthStatus> {
    return { status: 'ok' };
  }
}
