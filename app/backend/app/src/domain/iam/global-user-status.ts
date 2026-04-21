export type GlobalUserStatus = 'Active' | 'Disabled';

export interface GlobalUserProfile {
  userId: string;
  globalStatus: GlobalUserStatus;
}
