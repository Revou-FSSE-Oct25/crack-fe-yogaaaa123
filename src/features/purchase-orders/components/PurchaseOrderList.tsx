'use client';

import { useState } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { PurchaseOrderStatus } from '../types';

const statusColors: Record<PurchaseOrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RECEIVED: 'bg-green-100 text-green-800',
  PARTIAL: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function PurchaseOrderList() {
  const { data, isLoading } = usePurchaseOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatus | 'ALL'>('ALL');

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading purchase orders...</div>;
  }

  const orders = data ?? [];

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Purchase Order History</h2>
        <Link href="/dashboard/admin/purchase-orders/new">
          <Button>+ New Purchase Order</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by order number or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PurchaseOrderStatus | 'ALL')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="RECEIVED">Received</option>
            <option value="PARTIAL">Partial</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4 shadow-sm">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {filteredOrders.filter(o => o.status === 'PENDING').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-green-50 p-4 shadow-sm">
          <p className="text-sm text-green-700">Received</p>
          <p className="text-2xl font-bold text-green-900">
            {filteredOrders.filter(o => o.status === 'RECEIVED').length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Total Value</p>
          <p className="text-xl font-bold text-blue-900">
            {formatCurrency(filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0))}
          </p>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'No purchase orders match your filters' 
              : 'No purchase orders found'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Amount
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.supplier.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/dashboard/admin/purchase-orders/${order.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Details
                    </Link>
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
