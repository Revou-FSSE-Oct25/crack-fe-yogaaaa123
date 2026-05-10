'use client';

import { useDashboardStats } from '@/features/reports/hooks/useDashboardStats';
import { useTopProducts } from '@/features/reports/hooks/useTopProducts';
import { useSalesTrend } from '@/features/reports/hooks/useSalesTrend';
import { useInventoryValue } from '@/features/reports/hooks/useInventoryValue';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: topProducts, isLoading: topLoading } = useTopProducts();
  const { data: salesTrend, isLoading: trendLoading } = useSalesTrend();
  const { data: invValue, isLoading: invLoading } = useInventoryValue();

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: '📦', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Products In Stock', value: stats?.totalProductsInStock ?? 0, icon: '🏪', gradient: 'from-green-500 to-emerald-600' },
    { label: 'Revenue Today', value: formatCurrency(Number(stats?.today?.revenue ?? 0)), icon: '💰', gradient: 'from-purple-500 to-pink-600' },
    { label: 'Low Stock Items', value: stats?.lowStockProducts?.length ?? 0, icon: '⚠️', gradient: 'from-orange-500 to-red-600', isWarning: (stats?.lowStockProducts?.length ?? 0) > 0 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
          Overview
        </h2>
        <p className="mt-1 text-sm text-slate-600">Monitor your store performance</p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-5 transition-opacity group-hover:opacity-10`} />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">{s.label}</p>
                  <p className={'mt-2 text-3xl font-bold ' + (s.isWarning ? 'text-red-600' : 'text-slate-900')}>{s.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-2xl shadow-md`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="text-xl">🏆</span>
            Top Products
          </h3>
          {topLoading ? <p className="py-8 text-center text-slate-400">Loading...</p>
          : !topProducts?.length ? <p className="py-8 text-center text-slate-400">No data</p>
          : <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-right">Sold</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p, i) => (
                    <tr key={i} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.productName}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{p.totalSold}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">{formatCurrency(Number(p.revenue))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="text-xl">📈</span>
            Sales Trend (7 days)
          </h3>
          {trendLoading ? <p className="py-8 text-center text-slate-400">Loading...</p>
          : !salesTrend?.length ? <p className="py-8 text-center text-slate-400">No data</p>
          : <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Sales</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salesTrend.map((s, i) => (
                    <tr key={i} className="transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{new Date(s.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{s.totalSales}</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">{formatCurrency(Number(s.totalRevenue))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="text-xl">📦</span>
          Inventory Value
        </h3>
        {invLoading ? <p className="text-center text-slate-400">Loading...</p>
        : <div className="flex items-baseline gap-2">
            <p className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              {invValue?.totalStockItems ?? 0}
            </p>
            <span className="text-lg font-medium text-slate-600">items in stock</span>
          </div>}
      </div>
    </div>
  );
}
