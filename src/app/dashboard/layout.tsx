import { cookies } from 'next/headers';
import { DashboardShell } from './DashboardShell';
import { AUTH_TOKEN_KEY, UserRole } from '@/infrastructure/utils/constants';
import { jwtVerify } from 'jose';

interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  tenantId?: string;
  isSuperAdmin?: boolean;
  isPlatformUser?: boolean;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  let userRole: UserRole | null = null;

  if (token) {
    try {
      // For simplicity, we're just decoding the token to get the role
      // In a real app, you might want to call a backend endpoint to verify the token
      const { payload } = await jwtVerify<JwtPayload>(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      userRole = payload.role;
    } catch (error) {
      console.error('Error decoding JWT in DashboardLayout:', error);
      // If token is invalid/expired, treat as logged out
      userRole = null;
    }
  }

  // Redirect if no role can be determined (not logged in or invalid token)
  if (!userRole) {
    // This will redirect to /login via the root page.tsx or middleware
    return <p>Redirecting to login...</p>;
  }

  return <DashboardShell role={userRole}>{children}</DashboardShell>;
}
