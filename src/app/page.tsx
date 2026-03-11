import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_TOKEN_KEY } from '@/infrastructure/utils/constants';

// ============================================================================
// Home page — redirects to login or dashboard based on auth state
// ============================================================================

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

  if (token) {
    redirect('/dashboard/admin');
  }

  redirect('/login');
}
