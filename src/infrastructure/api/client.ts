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
