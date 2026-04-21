import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MembershipsPage } from '../../src/pages/MembershipsPage';

describe('Tenant switching e2e flow', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('switches tenant context and keeps scope isolated by tenant id', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          items: [{ tenantId: 'tenant-001', userId: 'owner-001', role: 'Owner', status: 'Active' }],
          total: 1
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          items: [{ tenantId: 'tenant-002', userId: 'owner-002', role: 'Owner', status: 'Active' }],
          total: 1
        })
      });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <MembershipsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Loaded memberships: 1');
      expect(within(screen.getByRole('table')).getByText('owner-001')).toBeInTheDocument();
    });

    const tenantSelect = screen.getByLabelText('Active tenant', {
      selector: 'select'
    }) as HTMLSelectElement;

    fireEvent.change(tenantSelect, { target: { value: 'tenant-002' } });

    await waitFor(() => {
      expect(localStorage.getItem('iam.activeTenantId')).toBe('tenant-002');
      expect(within(screen.getByRole('table')).getByText('owner-002')).toBeInTheDocument();
    });

    const firstCall = fetchMock.mock.calls[0]?.[0] as string;
    const secondCall = fetchMock.mock.calls[1]?.[0] as string;
    expect(firstCall).toContain('/tenants/tenant-001/memberships');
    expect(secondCall).toContain('/tenants/tenant-002/memberships');
  });

  it('renders deterministic forbidden and conflict states from API contract', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ errorCode: 'auth.global_user_blocked', detail: 'blocked' })
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ errorCode: 'membership.last_owner_protection', detail: 'conflict' })
      });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <MembershipsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Access denied: global user status is not eligible.'
      );
    });

    const actorSelect = screen.getByLabelText('Actor user', {
      selector: 'select'
    }) as HTMLSelectElement;

    fireEvent.change(actorSelect, { target: { value: 'member-001' } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Conflict: membership invariant violation. Review role/status constraints.'
      );
    });
  });
});
