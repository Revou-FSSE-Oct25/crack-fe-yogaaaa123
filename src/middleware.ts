import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { AUTH_TOKEN_KEY, ROLE_HOME } from '@/infrastructure/utils/constants';
import type { UserRole } from '@/infrastructure/utils/constants';

// ---
// proxy.ts — Next.js 16 Request Interception Gateway
//
// Runs at the Edge before any route rendering.
// Responsibilities:
//   1. Verify JWT from HttpOnly cookie
//   2. Redirect unauthenticated users to /login
//   3. Redirect authenticated users away from /login
//   4. Enforce Role-Based Access Control (RBAC)
//   5. Forward user identity headers to Server Components
// ---

interface JWTPayload {
  sub: string;
  role: UserRole;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- 1. Attempt to decode JWT from cookie ----
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  let user: JWTPayload | null = null;

  if (token) {
    try {
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        console.error('CRITICAL: JWT_SECRET is not defined in environment variables!');
        user = null;
      } else {
        const secret = new TextEncoder().encode(secretKey);
        const { payload } = await jwtVerify(token, secret);
        user = payload as unknown as JWTPayload;
      }
    } catch {
      // Expired or tampered token — treat as unauthenticated
      user = null;
    }
  }

  const isLoginPage = pathname === '/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // ---- 2. Protect dashboard: kick unauthenticated users to /login ----
  if (isDashboardRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ---- 3. Redirect logged-in users away from public login page ----
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL(ROLE_HOME[user.role], request.url));
  }

  // ---- 4. Role-Based Access Control ----
  if (isDashboardRoute && user) {
    const isAdminRoute = pathname.startsWith('/dashboard/admin');
    const isCashierRoute = pathname.startsWith('/dashboard/cashier');

    if (isAdminRoute && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL(ROLE_HOME.STAFF, request.url));
    }

    if (isCashierRoute && user.role !== 'STAFF') {
      return NextResponse.redirect(new URL(ROLE_HOME.ADMIN, request.url));
    }
  }

  // ---- 5. Forward user identity to downstream Server Components ----
  const response = NextResponse.next();
  if (user) {
    response.headers.set('x-user-id', user.sub);
    response.headers.set('x-user-role', user.role);
  }

  return response;
}

// Only intercept navigational requests; skip static assets & API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
