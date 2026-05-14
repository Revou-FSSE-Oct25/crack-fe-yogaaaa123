// BE ResponseInterceptor wraps ALL responses:
//   { statusCode: number, message: string, data: T, timestamp: string }
// apiClient extracts .data automatically — callers receive T directly.
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// Paginated list response from BE (e.g. /products, /categories)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// Standardized error body
export interface ApiError {
  errorCode: string;
  message: string;
  validationErrors?: Record<string, string[]>;
}
