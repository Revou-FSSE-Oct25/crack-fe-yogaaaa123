import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SuperAdminShell } from './SuperAdminShell';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const role = headersList.get('x-user-role');

  if (role !== 'SUPER_ADMIN') {
    redirect('/super-admin/login');
  }

  return <SuperAdminShell>{children}</SuperAdminShell>;
}
