import type { GlobalUserStatusReaderPort } from '../../application/ports/iam/global-user-status-reader.port';
import type { GlobalUserProfile } from '../../domain/iam/global-user-status';

export class InMemoryGlobalUserStatusReaderAdapter implements GlobalUserStatusReaderPort {
  private readonly store = new Map<string, GlobalUserProfile>();

  constructor(seed: GlobalUserProfile[] = []) {
    for (const profile of seed) {
      this.store.set(profile.userId, profile);
    }
  }

  async getByUserId(userId: string): Promise<GlobalUserProfile | null> {
    return this.store.get(userId) ?? null;
  }
}
