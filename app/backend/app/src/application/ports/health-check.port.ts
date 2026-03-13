import type { HealthStatus } from '../../domain/health-status';

export interface HealthCheckPort {
  getStatus(): Promise<HealthStatus>;
}
