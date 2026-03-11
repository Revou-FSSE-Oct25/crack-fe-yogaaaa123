import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Overview — CrackPOS' };

// ============================================================================
// /dashboard/admin — Admin overview page
// ============================================================================

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>

      {/* Stat cards — will be populated with real data via TanStack Query */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Products', value: '—', icon: '📦' },
          { label: 'Transactions Today', value: '—', icon: '🧾' },
          { label: 'Revenue Today', value: '—', icon: '💰' },
          { label: 'Low Stock Items', value: '—', icon: '⚠️' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
