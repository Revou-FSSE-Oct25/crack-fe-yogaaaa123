'use client';

import { useTenants } from '../hooks/useTenants';
import Link from 'next/link';

export function TenantsList() {
  const { data: tenants, isLoading } = useTenants();

  if (isLoading) {
    return <div className="text-gray-500">Loading tenants...</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">All Tenants</h2>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Slug Prefix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tenants?.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {tenant.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{tenant.slug}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {tenant.slugPrefix}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {tenant._count.salesOrders}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link
                    href={`/super-admin/tenants/${tenant.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Details
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
