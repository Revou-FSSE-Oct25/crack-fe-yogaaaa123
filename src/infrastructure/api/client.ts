import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, ApiError } from './types';

// ============================================================================
// Production API Client
// - Standardized JSON fetch wrapper
// - Automatic Idempotency-Key injection for unsafe methods
// - Uniform error mapping to ApiError
// ============================================================================

const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Core fetch wrapper used by all TanStack Query hooks and Server Components.
 *
 * @param endpoint  - API path relative to NEXT_PUBLIC_API_URL (e.g. '/products')
 * @param options   - Standard RequestInit overrides
 * @param idempotent - When true, attaches a UUID Idempotency-Key header for
 *                     mutation safety (prevents duplicate transactions)
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  idempotent = false,
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const headers = new Headers(options.headers);

  // Default content type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject idempotency key for mutations to prevent double-charges
  const method = (options.method ?? 'GET').toUpperCase();
  if (idempotent && UNSAFE_METHODS.includes(method)) {
    headers.set('Idempotency-Key', uuidv4());
  }

  // ==========================================================================
  // 🚨 TEMPORARY MOCK INTERCEPTOR FOR UI TESTING 🚨
  // Remove this block once the NestJS backend is ready.
  // ==========================================================================
  if (endpoint.includes('/auth/login')) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    try {
      const bodyStr = options.body?.toString() || '{}';
      const credentials = JSON.parse(bodyStr);

      if (credentials.username === 'admin' && credentials.password === 'password') {
        return {
          success: true,
          message: 'Mock login successful',
          data: {
            token: 'mock-jwt-token-admin-12345',
            user: { id: 'usr-1', name: 'Admin User', role: 'ADMIN' },
          } as unknown as T,
        };
      } else if (credentials.username === 'cashier' && credentials.password === 'password') {
        return {
          success: true,
          message: 'Mock login successful',
          data: {
            token: 'mock-jwt-token-cashier-67890',
            user: { id: 'usr-2', name: 'Cashier User', role: 'EMPLOYEE' },
          } as unknown as T,
        };
      } else {
        throw new Error('Invalid mock credentials. Use admin/password or cashier/password.');
      }
    } catch (e: any) {
      throw { errorCode: 'ERR_UNAUTHORIZED', message: e.message || 'Login failed' };
    }
  }

  if ((endpoint.includes('/products') || endpoint.includes('/api/products')) && (!options.method || options.method === 'GET')) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Mock products fetched',
      data: [
        { id: '1', name: 'Signature Espresso Blend', price: 45000, stock: 50, categoryId: 'cat-1', categoryName: 'Coffee Beans' },
        { id: '2', name: 'Oat Milk 1L', price: 35000, stock: 4, categoryId: 'cat-2', categoryName: 'Dairy & Alternatives' },
        { id: '3', name: 'V60 Paper Filters (100pcs)', price: 75000, stock: 120, categoryId: 'cat-3', categoryName: 'Equipment' },
        { id: '4', name: 'Caramel Syrup', price: 85000, stock: 15, categoryId: 'cat-4', categoryName: 'Syrups' },
      ] as unknown as T,
      meta: { currentPage: 1, totalPages: 1, totalItems: 4, perPage: 10 },
    };
  }
  // ==========================================================================

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    method,
    headers,
  });

  const body = await response.json().catch(() => null);

  if (!response.ok || (body && !body.success)) {
    const error: ApiError = body ?? {
      errorCode: 'ERR_UNKNOWN',
      message: `Request failed with status ${response.status}`,
    };
    throw error;
  }

  return body as ApiResponse<T>;
}
