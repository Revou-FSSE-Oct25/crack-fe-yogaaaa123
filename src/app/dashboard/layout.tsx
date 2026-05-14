import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardShell } from './DashboardShell';
import type { UserRole } from '@/infrastructure/utils/constants';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const role = headersList.get('x-user-role') as UserRole | null;

  if (!role) {
    redirect('/login');
  }

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
