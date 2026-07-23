// lib/services/api-client.ts
// Typed fetch client for all LiveCalicut /api/v1/ endpoints

import type { ApiResponse, ApiMeta } from '@/lib/types/api.types';
import { createClient } from '@/lib/supabase/client';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: unknown[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {
    // Ignore session retrieval failure in unauthenticated states
  }
  return {};
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T; meta?: ApiMeta }> {
  const url = `${BASE_URL}${path}`;
  const authHeaders = await getAuthHeader();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new ApiError(
      json.message || `API error ${response.status}`,
      response.status,
      json.errors
    );
  }

  return { data: json.data, meta: json.meta };
}

function buildSearchParams(params: Record<string, unknown>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  });
  const str = sp.toString();
  return str ? `?${str}` : '';
}

// ---- Businesses ----
export const businessApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/v1/businesses${buildSearchParams(params)}`),
  get: (slug: string) =>
    apiFetch(`/api/businesses/${slug}`),
  categories: () =>
    apiFetch('/api/businesses/categories'),
  addReview: (slug: string, payload: { rating: number; comment: string }) =>
    apiFetch('/api/businesses/review', { method: 'POST', body: JSON.stringify({ slug, ...payload }) }),
  create: (payload: Record<string, unknown>) =>
    apiFetch('/api/businesses', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- Jobs ----
export const jobsApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/v1/jobs${buildSearchParams(params)}`),
  get: (slug: string) =>
    apiFetch(`/api/jobs/${slug}`),
  apply: (slug: string, payload: Record<string, unknown>) =>
    apiFetch('/api/jobs/apply', { method: 'POST', body: JSON.stringify({ slug, ...payload }) }),
  create: (payload: Record<string, unknown>) =>
    apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- Marketplace ----
export const marketplaceApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/marketplace${buildSearchParams(params)}`),
  get: (slug: string) =>
    apiFetch(`/api/marketplace/${slug}`),
  categories: () =>
    apiFetch('/api/marketplace/categories'),
  create: (payload: Record<string, unknown>) =>
    apiFetch('/api/marketplace', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- Properties ----
export const propertiesApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/properties${buildSearchParams(params)}`),
  get: (slug: string) =>
    apiFetch(`/api/properties/${slug}`),
  inquiry: (payload: Record<string, unknown>) =>
    apiFetch('/api/properties/inquiry', { method: 'POST', body: JSON.stringify(payload) }),
  create: (payload: Record<string, unknown>) =>
    apiFetch('/api/properties', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- News ----
export const newsApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/news${buildSearchParams(params)}`),
  get: (slug: string) =>
    apiFetch(`/api/news/${slug}`),
};

// ---- Events ----
export const eventsApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/events${buildSearchParams(params)}`),
  get: (slug: string) =>
    apiFetch(`/api/events/${slug}`),
};

// ---- Search ----
export const searchApi = {
  search: (params: Record<string, unknown>) =>
    apiFetch(`/api/v1/search${buildSearchParams(params)}`),
  suggestions: (q: string, city = 'calicut') =>
    apiFetch(`/api/v1/search/suggestions?q=${encodeURIComponent(q)}&city=${city}`),
  trending: (city = 'calicut') =>
    apiFetch(`/api/v1/search/trending?city=${city}`),
  recent: () =>
    apiFetch('/api/v1/search/recent'),
  save: (payload: Record<string, unknown>) =>
    apiFetch('/api/v1/search/save', { method: 'POST', body: JSON.stringify(payload) }),
  clearHistory: () =>
    apiFetch('/api/v1/search/history', { method: 'DELETE' }),
};

// ---- Digital Asset Management (Media Upload) ----
export const mediaApi = {
  upload: async (file: File, module = 'general') => {
    const authHeaders = await getAuthHeader();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', module);

    const response = await fetch(`${BASE_URL}/api/v1/media/upload`, {
      method: 'POST',
      headers: { ...authHeaders },
      body: formData,
      credentials: 'include',
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new ApiError(json.message || 'File upload failed', response.status);
    }
    return json.data as { url: string; media_id: string };
  },
};

// ---- Notifications ----
export const notificationsApi = {
  list: () => apiFetch('/api/notifications'),
  markRead: (id: string) =>
    apiFetch('/api/notifications/read', { method: 'POST', body: JSON.stringify({ id }) }),
  live: () => apiFetch('/api/v1/notifications/live'),
};

// ---- Merchant ----
export const merchantApi = {
  dashboard: () => apiFetch('/api/v1/merchant/dashboard'),
  profile: () => apiFetch('/api/v1/merchant/profile'),
  updateProfile: (payload: Record<string, unknown>) =>
    apiFetch('/api/v1/merchant/profile', { method: 'PATCH', body: JSON.stringify(payload) }),
  leads: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/v1/merchant/leads${buildSearchParams(params)}`),
};

// ---- Admin ----
export const adminApi = {
  dashboard: () => apiFetch('/api/admin/dashboard'),
  users: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/v1/admin/users${buildSearchParams(params)}`),
  auditLogs: (params: Record<string, unknown> = {}) =>
    apiFetch(`/api/v1/admin/audit-logs${buildSearchParams(params)}`),
  approveEntity: (payload: { entity_type: string; entity_id: string; status: string }) =>
    apiFetch('/api/v1/admin/approve', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- Payments ----
export const paymentsApi = {
  createOrder: (planId: string) =>
    apiFetch('/api/payments/create-order', { method: 'POST', body: JSON.stringify({ planId }) }),
  verify: (payload: Record<string, unknown>) =>
    apiFetch('/api/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),
};

// ---- Home / Categories / Cities ----
export const homeApi = {
  home: () => apiFetch('/api/v1/home'),
  categories: () => apiFetch('/api/v1/categories'),
  cities: () => apiFetch('/api/v1/cities'),
};
