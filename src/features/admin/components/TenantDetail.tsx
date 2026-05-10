'use client';

import { useTenantDetail } from '../hooks/useTenantDetail';
import { useParams } from 'next/navigation';

export function TenantDetail() {
  const params = useParams();
  const tenantId = params.id as string;
  const { data: tenant, isLoading } = useTenantDetail(tenantId);

  if (isLoading) {
    return <div className="text-gray-500">Loading tenant details...</div>;
  }

  if (!tenant) {
    return <div className="text-red-500">Tenant not found</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{tenant.name}</h2>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Store Information</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Slug</dt>
            <dd className="mt-1 text-sm text-gray-900">{tenant.slug}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Slug Prefix</dt>
            <dd className="mt-1 text-sm text-gray-900">{tenant.slugPrefix}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(tenant.createdAt).toLocaleDateString('id-ID')}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Statistics</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Products</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">{tenant.stats._count.products}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Sales Orders</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">{tenant.stats._count.salesOrders}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Users</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">{tenant.stats._count.users}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Owners ({tenant.owners.length})</h3>
        <div className="space-y-2">
          {tenant.owners.map((owner) => (
            <div key={owner.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <div>
                <span className="text-sm font-medium text-gray-900">{owner.user.username}</span>
                <span className="ml-2 text-xs text-gray-500">{owner.user.email}</span>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                OWNER
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
