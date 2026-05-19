import { v4 as uuidv4 } from 'uuid';
import type { ApiError } from './types';
import { fetchCsrfToken, resetCsrfToken } from './csrf';

const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

let refreshPromise: Promise<boolean> | null = null;
let redirecting = false;

// Detect JWT mode from cookie
function getJwtMode(): 'platform' | 'tenant' | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';').map(c => c.trim());
  const platformJwt = cookies.find(c => c.startsWith('platform_jwt='));
  const tenantJwt = cookies.find(c => c.startsWith('access_token='));
  
  if (platformJwt) return 'platform';
  if (tenantJwt) return 'tenant';
  return null;
}

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      setTimeout(() => { refreshPromise = null; }, 1000);
    }
  })();

  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window === 'undefined' || redirecting) return;
  redirecting = true;
  window.location.href = '/login';
}

function redirectToCreateStore() {
  if (typeof window === 'undefined' || redirecting) return;
  redirecting = true;
  window.location.href = '/create-store';
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  idempotent = false,
  isRetry = false,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const headers = new Headers(options.headers);
  const method = (options.method ?? 'GET').toUpperCase();

  if (!headers.has('Content-Type') && method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  // Send JWT from cookie as Bearer header for proxied requests
  const cookies = document.cookie.split('; ').reduce((acc, c) => { const [k, v] = c.split('='); if(k) acc[k.trim()] = v; return acc; }, {} as Record<string, string>);
  const authToken = cookies['auth_token'] || cookies['at'];
  if (authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  if (UNSAFE_METHODS.includes(method)) {
    const token = await fetchCsrfToken();
    headers.set('X-CSRF-Token', token);
  }

  if (idempotent && UNSAFE_METHODS.includes(method)) {
    headers.set('Idempotency-Key', uuidv4());
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
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
    if (response.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/refresh' && endpoint !== '/auth/google' && endpoint !== '/auth/create-store') {
      const mode = getJwtMode();
      
      if (mode === 'platform') {
        // Platform JWT expired → redirect to create-store
        redirectToCreateStore();
        throw new Error('Platform session expired');
      } else if (mode === 'tenant') {
        // Tenant JWT expired → try refresh
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          resetCsrfToken();
          return apiClient<T>(endpoint, options, idempotent, true);
        }
        redirectToLogin();
      } else {
        // No JWT → redirect to login
        redirectToLogin();
      }
    }

    const error: ApiError = {
      errorCode: body?.errorCode ?? `ERR_${response.status}`,
      message: body?.message ?? `Request failed with status ${response.status}`,
      validationErrors: body?.validationErrors ?? body?.data?.validationErrors,
    };
    throw error;
  }

  if (body && typeof body === 'object' && 'data' in body && 'statusCode' in body) {
    return body.data as T;
  }

  return body as T;
}

apiClient.get = <T>(endpoint: string, options?: RequestInit) =>
  apiClient<T>(endpoint, { ...options, method: 'GET' });

apiClient.post = <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
  apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

apiClient.put = <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
  apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

apiClient.patch = <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
  apiClient<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

apiClient.delete = <T>(endpoint: string, options?: RequestInit) =>
  apiClient<T>(endpoint, { ...options, method: 'DELETE' });
