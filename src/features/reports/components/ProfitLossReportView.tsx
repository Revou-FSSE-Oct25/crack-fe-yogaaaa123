'use client';

import { Suspense } from 'react';
import { useProfitLossReport } from '../hooks/useProfitLossReport';
import { useExportCsv } from '../hooks/useExportCsv';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { useSearchParams, useRouter } from 'next/navigation';

function ProfitLossReportContent() {
  const { data, isLoading } = useProfitLossReport();
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

    const filename = `profit-loss-report-${new Date().toISOString().split('T')[0]}.csv`;
    exportMutation.mutate({
      endpoint: `/reports/profit-loss?${qs.toString()}`,
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profit & Loss Report</h2>
        <Button onClick={handleExport} isLoading={exportMutation.isPending}>
          📥 Export CSV
        </Button>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-green-700">Income</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Sales</dt>
              <dd className="text-sm font-semibold text-gray-900">{formatCurrency(data?.income.sales ?? 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Other Income</dt>
              <dd className="text-sm font-semibold text-gray-900">{formatCurrency(data?.income.other ?? 0)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <dt className="text-base font-semibold text-gray-900">Total Income</dt>
              <dd className="text-base font-bold text-green-600">{formatCurrency(data?.income.total ?? 0)}</dd>
            </div>
          </dl>
        </div>

        {/* Expenses Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-red-700">Expenses</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Cost of Goods Sold (COGS)</dt>
              <dd className="text-sm font-semibold text-gray-900">{formatCurrency(data?.expenses.cogs ?? 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Purchases</dt>
              <dd className="text-sm font-semibold text-gray-900">{formatCurrency(data?.expenses.purchases ?? 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Other Expenses</dt>
              <dd className="text-sm font-semibold text-gray-900">{formatCurrency(data?.expenses.other ?? 0)}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <dt className="text-base font-semibold text-gray-900">Total Expenses</dt>
              <dd className="text-base font-bold text-red-600">{formatCurrency(data?.expenses.total ?? 0)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Net Profit */}
      <div className="mt-6 rounded-lg border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Net Profit</h3>
          <p className={`text-4xl font-bold ${(data?.netProfit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data?.netProfit ?? 0)}
          </p>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {(data?.netProfit ?? 0) >= 0 ? '✅ Profitable' : '⚠️ Loss'}
        </p>
      </div>
    </div>
  );
}

export function ProfitLossReportView() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading...</div>}>
      <ProfitLossReportContent />
    </Suspense>
  );
}
