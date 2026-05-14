'use client';

import { Suspense } from 'react';
import { useSalesReport } from '../hooks/useSalesReport';
import { useExportCsv } from '../hooks/useExportCsv';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { useSearchParams, useRouter } from 'next/navigation';

function SalesReportContent() {
  const { data, isLoading } = useSalesReport();
  const exportMutation = useExportCsv();
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';

  const handleExport = () => {
    const qs = new URLSearchParams();
    if (startDate) qs.set('startDate', startDate);
    if (endDate) qs.set('endDate', endDate);
    qs.set('export', 'csv');

    const filename = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportMutation.mutate({
      endpoint: `/reports/sales?${qs.toString()}`,
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
        <h2 className="text-2xl font-bold text-gray-900">Sales Report</h2>
        <Button onClick={handleExport} isLoading={exportMutation.isPending}>
          📥 Export CSV
        </Button>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

      {summary && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.totalSales)}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Profit</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{formatCurrency(summary.totalProfit)}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Order Number</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Total Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Profit</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {new Date(item.date).toLocaleDateString('id-ID')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {item.orderNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(item.totalAmount)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-green-600">
                  {formatCurrency(item.profit)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SalesReportView() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading...</div>}>
      <SalesReportContent />
    </Suspense>
  );
}
