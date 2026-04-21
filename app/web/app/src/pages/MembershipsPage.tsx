import { useEffect, useMemo, useState } from 'react';
import {
  listMemberships,
  mapIamErrorToMessage,
  updateMembershipRole,
  updateMembershipStatus,
  type MembershipListResponse,
  type TenantMembership
} from '../services/api';

const DEFAULT_TENANT = 'tenant-001';
const TENANT_STORAGE_KEY = 'iam.activeTenantId';
const ACTOR_STORAGE_KEY = 'iam.actorUserId';

function getPersistedValue(key: string, fallback: string): string {
  const value = localStorage.getItem(key);
  return value && value.trim().length > 0 ? value : fallback;
}

function persistValue(key: string, value: string): void {
  localStorage.setItem(key, value);
}

type PageState =
  | { type: 'loading' }
  | { type: 'ready'; payload: MembershipListResponse }
  | { type: 'error'; message: string };

export function MembershipsPage(): JSX.Element {
  const [tenantId, setTenantId] = useState(() => getPersistedValue(TENANT_STORAGE_KEY, DEFAULT_TENANT));
  const [actorUserId, setActorUserId] = useState(() => getPersistedValue(ACTOR_STORAGE_KEY, 'owner-001'));
  const [state, setState] = useState<PageState>({ type: 'loading' });
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    persistValue(TENANT_STORAGE_KEY, tenantId);
    persistValue(ACTOR_STORAGE_KEY, actorUserId);
  }, [tenantId, actorUserId]);

  async function loadMemberships(): Promise<void> {
    setState({ type: 'loading' });
    try {
      const payload = await listMemberships({ tenantId, actorUserId });
      setState({ type: 'ready', payload });
    } catch (error) {
      setState({ type: 'error', message: mapIamErrorToMessage(error) });
    }
  }

  useEffect(() => {
    void loadMemberships();
  }, [tenantId, actorUserId]);

  const rows = useMemo<TenantMembership[]>(() => {
    if (state.type !== 'ready') {
      return [];
    }

    return state.payload.items;
  }, [state]);

  async function promoteToViewer(userId: string): Promise<void> {
    setIsMutating(true);
    try {
      await updateMembershipRole({ tenantId, actorUserId, userId, role: 'Viewer' });
      await loadMemberships();
    } catch (error) {
      setState({ type: 'error', message: mapIamErrorToMessage(error) });
    } finally {
      setIsMutating(false);
    }
  }

  async function suspend(userId: string): Promise<void> {
    setIsMutating(true);
    try {
      await updateMembershipStatus({ tenantId, actorUserId, userId, status: 'Suspended' });
      await loadMemberships();
    } catch (error) {
      setState({ type: 'error', message: mapIamErrorToMessage(error) });
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <section>
      <h2>Tenant Memberships</h2>
      <p>Tenant context is persisted in local storage and sent in every IAM request.</p>

      <div className="controls">
        <label>
          Active tenant
          <select value={tenantId} onChange={(event) => setTenantId(event.target.value)}>
            <option value="tenant-001">tenant-001</option>
            <option value="tenant-002">tenant-002</option>
          </select>
        </label>

        <label>
          Actor user
          <select value={actorUserId} onChange={(event) => setActorUserId(event.target.value)}>
            <option value="owner-001">owner-001</option>
            <option value="member-001">member-001</option>
            <option value="disabled-001">disabled-001</option>
            <option value="owner-002">owner-002</option>
          </select>
        </label>
      </div>

      {state.type === 'loading' && <p role="status">Loading memberships...</p>}
      {state.type === 'error' && <p role="alert">{state.message}</p>}

      {state.type === 'ready' && (
        <div>
          <p role="status">Loaded memberships: {state.payload.total}</p>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={`${item.tenantId}:${item.userId}`}>
                  <td>{item.userId}</td>
                  <td>{item.role}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => promoteToViewer(item.userId)}
                    >
                      Set Viewer
                    </button>
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => suspend(item.userId)}
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
