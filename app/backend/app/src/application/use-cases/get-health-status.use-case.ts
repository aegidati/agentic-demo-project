import type { HealthStatus } from '../../domain/health-status';
import type { HealthCheckPort } from '../ports/health-check.port';

export class GetHealthStatusUseCase {
  constructor(private readonly healthCheckPort: HealthCheckPort) {}

  execute(): Promise<HealthStatus> {
    return this.healthCheckPort.getStatus();
  }
}
