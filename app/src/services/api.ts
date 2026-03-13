export interface HealthResponse {
  status: string;
}

const DEFAULT_BASE_URL = 'http://localhost:3000';

function getBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  const baseUrl = configured && configured.length > 0 ? configured : DEFAULT_BASE_URL;
  return baseUrl.replace(/\/$/, '');
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${getBaseUrl()}/health`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const body = (await response.json()) as HealthResponse;

  if (!body || typeof body.status !== 'string') {
    throw new Error('Invalid health response format');
  }

  return body;
}
