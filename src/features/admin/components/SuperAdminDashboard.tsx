'use client';

import { usePlatformStats } from '../hooks/usePlatformStats';
import { Building2, Users, Package, ShoppingCart, ClipboardList } from 'lucide-react';

export function SuperAdminDashboard() {
  const { data: stats, isLoading } = usePlatformStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[120px] animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  const platformStats = stats?.platform;

  const cards = [
    {
      label: 'Total Tenants',
      value: platformStats?.totalTenants ?? 0,
      icon: Building2,
      gradient: 'from-blue-500 to-indigo-600',
      textColor: 'text-slate-900',
    },
    {
      label: 'Total Users',
      value: platformStats?.totalUsers ?? 0,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Total Products',
      value: platformStats?.totalProducts ?? 0,
      icon: Package,
      gradient: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-600',
    },
    {
      label: 'Total Sales',
      value: platformStats?.totalSalesOrders ?? 0,
      icon: ShoppingCart,
      gradient: 'from-orange-500 to-rose-600',
      textColor: 'text-orange-600',
    },
    {
      label: 'Purchase Orders',
      value: platformStats?.totalPurchaseOrders ?? 0,
      icon: ClipboardList,
      gradient: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-600',
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Platform Overview</h2>
        <p className="mt-1 text-sm text-slate-500">High-level metrics across all tenants</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="animate-fade-in group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-[0.03] transition-opacity group-hover:opacity-[0.07]`}
              />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500">{c.label}</p>
                  <p className={`mt-2 text-3xl font-bold tracking-tight ${c.textColor}`}>
                    {c.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-sm`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
