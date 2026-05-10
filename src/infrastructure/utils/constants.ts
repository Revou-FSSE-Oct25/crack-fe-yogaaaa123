// ---
// Application-wide constants
// ---

/** Cookie key used to store the JWT auth token */
export const AUTH_TOKEN_KEY = 'auth_token';

/** TanStack Query cache keys — centralised to avoid typos */
export const QUERY_KEYS = {
  products: ['products'] as const,
  productDetail: (id: string) => ['products', id] as const,
  sales: ['sales'] as const,
  transactions: ['transactions'] as const,
  transactionDetail: (id: string) => ['transactions', id] as const,
  reports: ['reports'] as const,
  categories: ['categories'] as const,
  currentUser: ['currentUser'] as const,
} as const;

/** User role enum matching the NestJS backend */
export type UserRole = 'ADMIN' | 'STAFF';

/** Route maps per role — used by proxy.ts and client-side redirects */
export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: '/dashboard/admin',
  STAFF: '/dashboard/cashier',
};
