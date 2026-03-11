import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layouts/Sidebar';
import { DashboardHeader } from '@/components/layouts/DashboardHeader';
import type { UserRole } from '@/infrastructure/utils/constants';

// ============================================================================
// Dashboard Layout — Server Component shell
// Reads user identity from headers set by proxy.ts
// ============================================================================

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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar role={role} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader role={role} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
