'use client';

import { useTransaction } from '../hooks/useTransaction';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';

interface TransactionDetailProps {
  id: string;
}

export function TransactionDetail({ id }: TransactionDetailProps) {
  const { data: transaction, isLoading } = useTransaction(id);

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>;
  }

  if (!transaction) {
    return <div className="py-12 text-center text-red-500">Transaction not found</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{transaction.orderNumber}</h2>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              transaction.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : transaction.status === 'CANCELLED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Transaction Information</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">User</dt>
            <dd className="mt-1 text-sm text-gray-900">{transaction.user.username}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(transaction.totalPrice)}</dd>
          </div>
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
              {transaction.items.map((item) => (
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
                  {formatCurrency(transaction.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
