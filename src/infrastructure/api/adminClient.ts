import type { ApiError } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let redirecting = false;

function redirectToSuperAdminLogin() {
  if (typeof window === 'undefined' || redirecting) return;
  redirecting = true;
  window.location.href = '/super-admin/login';
}

async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const method = (options.method ?? 'GET').toUpperCase();

  if (!headers.has('Content-Type') && method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      redirectToSuperAdminLogin();
      throw new Error('Super admin session expired');
    }

    const error: ApiError = {
      errorCode: body?.errorCode ?? `ERR_${response.status}`,
      message: body?.message ?? `Request failed with status ${response.status}`,
      validationErrors: body?.validationErrors,
    };
    throw error;
  }

  // Unwrap BE response wrapper
  if (body && typeof body === 'object' && 'data' in body && 'statusCode' in body) {
    return body.data as T;
  }

  return body as T;
}

class AdminApiClient {
  async get<T>(url: string) {
    return adminFetch<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, data?: unknown) {
    return adminFetch<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: unknown) {
    return adminFetch<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(url: string, data?: unknown) {
    return adminFetch<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string) {
    return adminFetch<T>(url, { method: 'DELETE' });
  }
}

export const adminApiClient = new AdminApiClient();
