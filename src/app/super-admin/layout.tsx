import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const role = headersList.get('x-user-role');

  // Only SUPER_ADMIN can access
  if (role !== 'SUPER_ADMIN') {
    redirect('/super-admin/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <span className="text-2xl">🔐</span>
          <span className="ml-3 text-lg font-bold text-gray-900">Super Admin</span>
        </div>
        <nav className="p-4">
          <a
            href="/super-admin/dashboard"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/super-admin/tenants"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Tenants
          </a>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h1 className="text-xl font-semibold text-gray-900">Platform Administration</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
