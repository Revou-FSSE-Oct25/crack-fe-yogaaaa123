'use client';

import { useDashboardStats } from '@/features/reports/hooks/useDashboardStats';
import { useTopProducts } from '@/features/reports/hooks/useTopProducts';
import { useSalesTrend } from '@/features/reports/hooks/useSalesTrend';
import { useInventoryValue } from '@/features/reports/hooks/useInventoryValue';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import {
  Package,
  Store,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Warehouse,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: topProducts, isLoading: topLoading } = useTopProducts();
  const { data: salesTrend, isLoading: trendLoading } = useSalesTrend();
  const { data: invValue, isLoading: invLoading } = useInventoryValue();

  const lowStockCount = stats?.lowStockProducts?.length ?? 0;

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'catalog',
    },
    {
      label: 'Products In Stock',
      value: stats?.totalProductsInStock ?? 0,
      icon: Store,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'available',
    },
    {
      label: 'Revenue Today',
      value: formatCurrency(Number(stats?.today?.revenue ?? 0)),
      icon: TrendingUp,
      gradient: 'from-violet-500 to-purple-600',
      badge: 'today',
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount,
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-600',
      badge: lowStockCount > 0 ? 'attention' : 'all good',
      isWarning: lowStockCount > 0,
    },
  ];

  const chartData = Array.isArray(salesTrend)
    ? salesTrend.map((s) => ({
        date: new Date(s.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
        Sales: s.totalSales,
        Revenue: Number(s.totalRevenue),
      }))
    : [];

  const topProductsChart = Array.isArray(topProducts)
    ? topProducts.slice(0, 6).map((p) => ({
        name: (p.productName ?? '').length > 14
          ? (p.productName ?? '').slice(0, 14) + '...'
          : (p.productName ?? ''),
        Sold: p.totalSold,
      }))
    : [];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Page header */}
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">Monitor your store performance at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[116px] animate-pulse rounded-2xl bg-slate-100" />
            ))
          : statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="animate-fade-in group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-[0.03] transition-opacity group-hover:opacity-[0.07]`}
                  />
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-500">{s.label}</p>
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            s.isWarning
                              ? 'bg-red-50 text-red-600'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {s.badge}
                        </span>
                      </div>
                      <p
                        className={`mt-2 text-3xl font-bold tracking-tight ${
                          s.isWarning ? 'text-red-600' : 'text-slate-900'
                        }`}
                      >
                        {s.value}
                      </p>
                    </div>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Trend — Area Chart */}
        <div className="animate-fade-in rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
              Sales Trend (7 days)
            </h3>
            {!trendLoading && chartData.length > 0 && (
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                +{chartData[chartData.length - 1]?.Revenue ? Math.round(chartData[chartData.length - 1].Revenue / 1000) : 0}K
              </span>
            )}
          </div>
          {trendLoading ? (
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
            ) : chartData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              No sales data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Products — Bar Chart */}
        <div className="animate-fade-in rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <ShoppingBag className="h-4.5 w-4.5 text-emerald-500" />
              Top Products
            </h3>
          </div>
          {topLoading ? (
            <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
          ) : topProductsChart.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              No product data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProductsChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="Sold" fill="#10b981" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row: Inventory Value */}
      <div className="animate-fade-in rounded-2xl border border-slate-200/60 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Warehouse className="h-4.5 w-4.5 text-indigo-500" />
              Inventory Overview
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Total stock items across all products
            </p>
          </div>
          {invLoading ? (
            <div className="h-14 w-40 animate-pulse rounded-lg bg-slate-100" />
          ) : (
            <div className="text-right">
              <p className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                {invValue?.totalStockItems ?? 0}
              </p>
              <p className="text-sm font-medium text-slate-500">items in stock</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
