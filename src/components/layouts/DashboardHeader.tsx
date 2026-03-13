import type { UserRole } from '@/infrastructure/utils/constants';

// ---
// DashboardHeader — Displays page title and user info
// ---

interface DashboardHeaderProps {
  role: UserRole;
  userName?: string;
}

export function DashboardHeader({ role, userName }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">
        {role === 'ADMIN' ? 'Admin Dashboard' : 'Point of Sale'}
      </h1>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          {role}
        </span>
        {userName && (
          <span className="text-sm text-gray-600">{userName}</span>
        )}
      </div>
    </header>
  );
}
