'use client';

import { Suspense } from 'react';
import { useInventoryReport } from '../hooks/useInventoryReport';
import { useExportCsv } from '../hooks/useExportCsv';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { useSearchParams, useRouter } from 'next/navigation';

function InventoryReportContent() {
  const { data, isLoading } = useInventoryReport();
  const exportMutation = useExportCsv();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get('categoryId') ?? '';
  const lowStock = searchParams.get('lowStock') ?? '';

  const handleExport = () => {
    const qs = new URLSearchParams();
    if (categoryId) qs.set('categoryId', categoryId);
    if (lowStock) qs.set('lowStock', lowStock);
    qs.set('export', 'csv');

    const filename = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportMutation.mutate({
      endpoint: `/reports/inventory?${qs.toString()}`,
      filename,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading report...</div>;
  }

  const items = data?.data ?? [];
  const summary = data?.summary;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Report</h2>
        <Button onClick={handleExport} isLoading={exportMutation.isPending}>
          📥 Export CSV
        </Button>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Low Stock Only</label>
            <select
              value={lowStock}
              onChange={(e) => handleFilterChange('lowStock', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Products</option>
              <option value="true">Low Stock Only</option>
            </select>
          </div>
        </div>
      </div>

      {summary && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalItems}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Value</p>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{formatCurrency(summary.totalValue)}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.productName}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900">{item.stock}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(item.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function InventoryReportView() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading...</div>}>
      <InventoryReportContent />
    </Suspense>
  );
}
