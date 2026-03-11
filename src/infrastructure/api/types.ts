// ============================================================================
// Standardized API Response & Error Contracts
// These generic types mirror the NestJS backend's response wrapper.
// ============================================================================

/**
 * Universal API response wrapper.
 * Every endpoint from the NestJS backend returns this shape.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/**
 * Pagination metadata attached to list endpoints.
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

/**
 * Standardized error body returned by the NestJS backend.
 * The `errorCode` field allows the frontend to react to specific domain errors
 * (e.g. 'ERR_INSUFFICIENT_STOCK') without brittle string matching on `message`.
 */
export interface ApiError {
  errorCode: string;
  message: string;
  validationErrors?: Record<string, string[]>;
}
