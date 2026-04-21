import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import * as iamApi from '../src/services/iamApi';

jest.mock('../src/services/iamApi');

const mockedApi = iamApi as jest.Mocked<typeof iamApi>;

describe('HomeScreen mobile IAM flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders deterministic forbidden state from API response', async () => {
    mockedApi.listMemberships.mockRejectedValueOnce(
      new iamApi.MobileApiError(403, 'auth.global_user_blocked', 'blocked')
    );
    mockedApi.mapMobileIamError.mockReturnValue('Access denied: global status blocked.');

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Access denied: global status blocked.')).toBeTruthy();
    });
  });

  it('renders deterministic conflict state after role mutation failure', async () => {
    mockedApi.listMemberships.mockResolvedValue({
      items: [{ tenantId: 'tenant-001', userId: 'member-001', role: 'Member', status: 'Active' }],
      total: 1
    });
    mockedApi.updateMembershipRole.mockRejectedValueOnce(
      new iamApi.MobileApiError(409, 'membership.last_owner_protection', 'conflict')
    );
    mockedApi.mapMobileIamError.mockReturnValue('Conflict: invariant violation from IAM API.');

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Loaded memberships: 1')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Set Viewer'));

    await waitFor(() => {
      expect(screen.getByText('Conflict: invariant violation from IAM API.')).toBeTruthy();
    });
  });
});
