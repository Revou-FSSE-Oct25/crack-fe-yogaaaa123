'use client';

import { usePurchaseOrder } from '../hooks/usePurchaseOrder';
import { useReceivePurchaseOrder } from '../hooks/useReceivePurchaseOrder';
import { useCancelPurchaseOrder } from '../hooks/useCancelPurchaseOrder';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import type { PurchaseOrderStatus } from '../types';

const statusColors: Record<PurchaseOrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RECEIVED: 'bg-green-100 text-green-800',
  PARTIAL: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

interface PurchaseOrderDetailProps {
  id: string;
}

export function PurchaseOrderDetail({ id }: PurchaseOrderDetailProps) {
  const { data: order, isLoading } = usePurchaseOrder(id);
  const receiveMutation = useReceivePurchaseOrder();
  const cancelMutation = useCancelPurchaseOrder();

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>;
  }

  if (!order) {
    return <div className="py-12 text-center text-red-500">Purchase order not found</div>;
  }

  const canReceive = order.status === 'PENDING' || order.status === 'PARTIAL';
  const canCancel = order.status === 'PENDING';

  const handleReceive = () => {
    if (confirm('Mark this purchase order as received?')) {
      receiveMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    if (confirm('Cancel this purchase order? This action cannot be undone.')) {
      cancelMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(order.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div className="flex gap-2">
          {canReceive && (
            <Button
              onClick={handleReceive}
              isLoading={receiveMutation.isPending}
              variant="success"
            >
              Mark as Received
            </Button>
          )}
          {canCancel && (
            <Button
              onClick={handleCancel}
              isLoading={cancelMutation.isPending}
              variant="danger"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Information</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Supplier</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.supplier.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(Number(order.totalPrice))}</dd>
          </div>
          {order.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Quantity</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Unit Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.product.sku}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  Total:
                </td>
                <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                  {formatCurrency(Number(order.totalPrice))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
