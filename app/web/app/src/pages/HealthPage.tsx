import { useEffect, useState } from 'react';
import { getHealth, type HealthResponse } from '../services/api';

type HealthState =
  | { type: 'loading' }
  | { type: 'success'; payload: HealthResponse }
  | { type: 'error'; message: string };

export function HealthPage(): JSX.Element {
  const [state, setState] = useState<HealthState>({ type: 'loading' });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const payload = await getHealth();
        if (!cancelled) {
          setState({ type: 'success', payload });
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          setState({ type: 'error', message });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2>Health</h2>
      {state.type === 'loading' && <p role="status">Loading health status...</p>}
      {state.type === 'success' && (
        <p role="status">Health check successful: {state.payload.status}</p>
      )}
      {state.type === 'error' && <p role="alert">Health check failed: {state.message}</p>}
    </section>
  );
}
