import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reports — CrackPOS' };

// ============================================================================
// /dashboard/admin/reports — Transaction reports & analytics (Admin only)
// ============================================================================

export default function AdminReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports</h2>

      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <span className="text-4xl">📈</span>
        <p className="mt-4 text-gray-500">
          Sales reports and analytics will be displayed here.
        </p>
        <p className="text-sm text-gray-400">
          Connect to the NestJS backend to populate real data.
        </p>
      </div>
    </div>
  );
}
