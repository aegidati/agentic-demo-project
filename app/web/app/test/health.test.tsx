import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { HealthPage } from '../src/pages/HealthPage';

describe('HealthPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders and shows success when health endpoint returns ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok' })
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <HealthPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Health' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Loading health status...');

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Health check successful: ok');
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/health', {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
  });
});
