'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export function ActivityLogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const action = searchParams.get('action') ?? '';
  const entity = searchParams.get('entity') ?? '';
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to first page
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Filters</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Action</label>
          <select
            value={action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Entity Type</label>
          <select
            value={entity}
            onChange={(e) => handleFilterChange('entity', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All Entities</option>
            <option value="Product">Product</option>
            <option value="SalesOrder">Sales Order</option>
            <option value="PurchaseOrder">Purchase Order</option>
            <option value="User">User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
