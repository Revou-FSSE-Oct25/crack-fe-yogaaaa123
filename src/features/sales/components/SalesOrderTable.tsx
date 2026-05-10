'use client';

import { useState } from 'react';
import { useSalesOrders } from '../hooks/useSalesOrders';
import { useSalesOrderDetail } from '../hooks/useSalesOrderDetail';
import { useCompleteSalesOrder, useCancelSalesOrder } from '../hooks/useCompleteSalesOrder';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import type { SalesOrder } from '../types';

function SalesDetailModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { data: order, isLoading } = useSalesOrderDetail(orderId);
  const complete = useCompleteSalesOrder();
  const cancel = useCancelSalesOrder();

  return (
    <Modal isOpen={!!orderId} onClose={onClose} title="Sales Order Detail">
      {isLoading ? (
        <p className="py-4 text-center text-gray-400">Loading...</p>
      ) : order ? (
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">{order.orderNumber}</span>
            <span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + (
              order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            )}>{order.status}</span>
          </div>
          <p>Cashier: {order.user?.username ?? '-'}</p>
          <p>Date: {new Date(order.createdAt).toLocaleString('id-ID')}</p>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-2 py-1 text-left">Product</th>
                <th className="px-2 py-1 text-right">Qty</th>
                <th className="px-2 py-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((item: { product?: { name: string }; quantity: number; unitPrice: number }, i: number) => (
                <tr key={i} className="border-b">
                  <td className="px-2 py-1">{item.product?.name}</td>
                  <td className="px-2 py-1 text-right">{item.quantity}</td>
                  <td className="px-2 py-1 text-right">{formatCurrency(Number(item.unitPrice))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-right font-bold">Total: {formatCurrency(Number(order.totalPrice))}</p>
          {order.status === 'PENDING' && (
            <div className="flex gap-2">
              <Button onClick={() => complete.mutate(orderId, { onSuccess: onClose })} isLoading={complete.isPending}>
                Complete
              </Button>
              <Button onClick={() => cancel.mutate(orderId, { onSuccess: onClose })} isLoading={cancel.isPending} variant="ghost">
                Cancel
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="py-4 text-center text-red-500">Order not found</p>
      )}
    </Modal>
  );
}

const columns: Column<SalesOrder>[] = [
  { header: 'Order', accessor: (row) => row.orderNumber },
  {
    header: 'Date',
    accessor: (row) => {
      const date = new Date(row.createdAt);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    },
  },
  { header: 'Cashier', accessor: (row) => row.user?.username ?? '-' },
  { header: 'Status', accessor: 'status' },
  { header: 'Total', accessor: (row) => formatCurrency(row.totalPrice) },
  {
    header: 'Items',
    accessor: (row) => (
      <div className="text-xs text-gray-500">
        {(row.items ?? []).map((item) => `${item.quantity}x ${item.product?.name}`).join(', ')}
      </div>
    ),
  },
];

export function SalesOrderTable() {
  const { data, isLoading } = useSalesOrders();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const orders = data ?? [];

  const actionColumn: Column<SalesOrder> = {
    header: 'Actions',
    accessor: (row) => (
      <div className="flex gap-1">
        <button onClick={() => setSelectedId(row.id)} className="text-indigo-600 hover:text-indigo-900 text-xs">
          Detail
        </button>
      </div>
    ),
  };

  const allColumns = [...columns, actionColumn];

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
        Loading sales orders...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Recent Sales Orders</h3>
      <DataTable columns={allColumns} data={orders} keyExtractor={(row) => row.id} />
      {selectedId && <SalesDetailModal orderId={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
