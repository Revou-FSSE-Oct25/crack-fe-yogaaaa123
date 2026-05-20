'use client';

import { useState } from 'react';
import { useReturns } from '../hooks/useReturns';
import { useUpdateReturnStatus } from '../hooks/useUpdateReturnStatus';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';
import type { SalesReturn } from '../types';

export function ReturnList() {
  const { data, isLoading } = useReturns();
  const updateStatus = useUpdateReturnStatus();
  const [selectedReturn, setSelectedReturn] = useState<SalesReturn | null>(null);

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading returns...</div>;
  }

  const returns = data?.data ?? [];

  const handleUpdateStatus = (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedReturn) return;
    updateStatus.mutate({ id: selectedReturn.id, status }, {
      onSuccess: () => setSelectedReturn(null),
    });
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
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
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedReturn(returnItem)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approval Modal */}
      <Modal
        isOpen={!!selectedReturn}
        onClose={() => setSelectedReturn(null)}
        title="Review Sales Return"
      >
        {selectedReturn && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Order Number</p>
                <p className="font-semibold">{selectedReturn.salesOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Refund</p>
                <p className="font-semibold text-red-600">{formatCurrency(selectedReturn.totalRefund)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Reason</p>
                <p className="mt-1 italic">"{selectedReturn.reason}"</p>
              </div>
            </div>

            {selectedReturn.status === 'PENDING' ? (
              <div className="flex justify-end gap-3">
                <Button
                  variant="danger"
                  onClick={() => handleUpdateStatus('REJECTED')}
                  isLoading={updateStatus.isPending}
                >
                  Reject Return
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleUpdateStatus('APPROVED')}
                  isLoading={updateStatus.isPending}
                >
                  Approve Return
                </Button>
              </div>
            ) : (
              <p className="text-center text-sm font-medium text-gray-400">
                This return has already been {selectedReturn.status.toLowerCase()}.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
