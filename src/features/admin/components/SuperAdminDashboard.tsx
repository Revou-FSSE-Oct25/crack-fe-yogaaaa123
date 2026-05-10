'use client';

import { usePlatformStats } from '../hooks/usePlatformStats';

export function SuperAdminDashboard() {
  const { data: stats, isLoading } = usePlatformStats();

  if (isLoading) {
    return <div className="text-gray-500">Loading platform statistics...</div>;
  }

  const platformStats = stats?.platform;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Platform Overview</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Tenants</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{platformStats?.totalTenants ?? 0}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{platformStats?.totalUsers ?? 0}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{platformStats?.totalProducts ?? 0}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{platformStats?.totalSalesOrders ?? 0}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Purchase Orders</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{platformStats?.totalPurchaseOrders ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
