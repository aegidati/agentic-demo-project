import type { GlobalUserProfile } from '../../../domain/iam/global-user-status';

export interface GlobalUserStatusReaderPort {
  getByUserId(userId: string): Promise<GlobalUserProfile | null>;
}
