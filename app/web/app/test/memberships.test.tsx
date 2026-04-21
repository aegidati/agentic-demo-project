import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MembershipsPage } from '../src/pages/MembershipsPage';

describe('MembershipsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('loads memberships with persisted tenant context and actor', async () => {
    localStorage.setItem('iam.activeTenantId', 'tenant-002');
    localStorage.setItem('iam.actorUserId', 'owner-002');

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [{ tenantId: 'tenant-002', userId: 'owner-002', role: 'Owner', status: 'Active' }], total: 1 })
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <MembershipsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Loaded memberships: 1');
    });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/tenants/tenant-002/memberships', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-actor-user-id': 'owner-002',
        'x-tenant-id': 'tenant-002'
      }
    });
  });

  it('maps conflict errors to deterministic alert message', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ errorCode: 'membership.last_owner_protection', detail: 'blocked' })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ items: [], total: 0 })
      });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <MembershipsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Conflict: membership invariant violation. Review role/status constraints.'
      );
    });

    const tenantSelect = screen.getByLabelText('Active tenant', {
      selector: 'select'
    }) as HTMLSelectElement;
    fireEvent.change(tenantSelect, { target: { value: 'tenant-002' } });

    expect(tenantSelect.value).toBe('tenant-002');

    await waitFor(() => {
      expect(localStorage.getItem('iam.activeTenantId')).toBe('tenant-002');
    });
  });
});
