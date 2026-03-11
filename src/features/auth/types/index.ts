import type { UserRole } from '@/infrastructure/utils/constants';

// ============================================================================
// Auth Domain Types
// ============================================================================

/** Credentials submitted from the LoginForm */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Shape returned by POST /auth/login from the NestJS backend */
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Authenticated user profile attached to the JWT */
export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
}
