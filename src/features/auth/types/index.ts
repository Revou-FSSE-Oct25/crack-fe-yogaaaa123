import type { UserRole } from '@/infrastructure/utils/constants';

// ---
// Auth Domain Types
// ---

/** Credentials submitted from the LoginForm */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Shape returned by POST /auth/login (BE sets cookies server-side) */
export interface LoginResponse {
  user: AuthUser; // access_token is in HttpOnly cookie, NOT in body
}

/** Shape returned by POST /auth/register */
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    role: UserRole;
    tenantId: string;
    storeName: string;
  };
}

/** Authenticated user profile from JWT payload */
export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  tenantId: string;
}
