'use client';

import { useTenants } from '../hooks/useTenants';
import Link from 'next/link';
import { Building2, ChevronRight, Store } from 'lucide-react';

export function TenantsList() {
  const { data: tenants, isLoading } = useTenants();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 pb-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">All Tenants</h2>
          <p className="mt-1 text-sm text-slate-500">
            {tenants?.length ?? 0} registered stores
          </p>
        </div>
      </div>

      <div className="animate-fade-in overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-2">
                  <Store className="h-3.5 w-3.5" />
                  Store
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Prefix
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sales
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants?.map((tenant, i) => (
              <tr
                key={tenant.id}
                className="animate-fade-in transition-colors hover:bg-slate-50/50"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                      <Building2 className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{tenant.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {tenant.slug}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {tenant.slugPrefix}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    {tenant._count.salesOrders} orders
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <Link
                    href={`/super-admin/tenants/${tenant.id}`}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50"
                  >
                    Details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
