'use client';

import { useReturns } from '../hooks/useReturns';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ReturnList() {
  const { data, isLoading } = useReturns();

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading returns...</div>;
  }

  const returns = data?.data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sales Returns</h2>
        <Link href="/dashboard/admin/returns/new">
          <Button>+ New Return</Button>
        </Link>
      </div>

      {returns.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No returns found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Sales Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Refund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {returns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {returnItem.salesOrder.orderNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-red-600">
                    {formatCurrency(returnItem.totalRefund)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {returnItem.reason.length > 50
                      ? `${returnItem.reason.substring(0, 50)}...`
                      : returnItem.reason}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        returnItem.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : returnItem.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {returnItem.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(returnItem.createdAt).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
