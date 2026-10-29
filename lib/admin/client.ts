// lib/admin/client.ts
// Browser helpers for the admin mutation endpoints. Each throws with the
// server's message so callers can surface it in a toast.

async function post(path: string, body: unknown) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.error?.message || json.error || json.message || `Request failed (${res.status})`);
  }
  return json;
}

export const adminApi = {
  update: (entityType: string, entityId: string, values: Record<string, unknown>) =>
    post('/api/v1/admin/update', { entityType, entityId, values }),

  remove: (entityType: string, entityId: string) =>
    post('/api/v1/admin/delete', { entityType, entityId, hardDelete: true }),

  moderate: (entityType: string, entityId: string, action: string) =>
    post('/api/v1/admin/approve', { entityType, entityId, action }),
};
