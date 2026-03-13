// Universal API response wrapper & pagination types mirroring NestJS backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

// Pagination metadata for list endpoints
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
}

// Standardized error body with errorCode to prevent brittle string matching
export interface ApiError {
  errorCode: string;
  message: string;
  validationErrors?: Record<string, string[]>;
}
