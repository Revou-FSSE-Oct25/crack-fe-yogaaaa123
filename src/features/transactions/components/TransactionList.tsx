'use client';

import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import Link from 'next/link';
import type { Transaction, TransactionStatus } from '../types';

const statusColors: Record<TransactionStatus, string> = {
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
};

export function TransactionList() {
  const { data, isLoading, refetch, error, isError } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('ALL');

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading transactions...</div>;
  }

  if (isError) {
    console.error('Error fetching transactions:', error);
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load transactions</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  console.log('Transaction data:', data);
  const transactions = data ?? [];

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'ALL') {
      const txDate = new Date(tx.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dateFilter === 'TODAY') {
        matchesDate = txDate >= today;
      } else if (dateFilter === 'WEEK') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = txDate >= weekAgo;
      } else if (dateFilter === 'MONTH') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = txDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate stats
  const totalRevenue = filteredTransactions
    .filter(tx => tx.status === 'COMPLETED')
    .reduce((sum, tx) => sum + tx.totalPrice, 0);
  
  const completedCount = filteredTransactions.filter(tx => tx.status === 'COMPLETED').length;
  const cancelledCount = filteredTransactions.filter(tx => tx.status === 'CANCELLED').length;
  const pendingCount = filteredTransactions.filter(tx => tx.status === 'PENDING').length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="mt-1 text-sm text-gray-500">View and manage all sales transactions</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          🔄 Refresh
        </button>
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
            placeholder="Search by order number or cashier..."
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
            onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | 'ALL')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="w-48">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            id="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-green-50 p-4 shadow-sm">
          <p className="text-sm text-green-700">Completed</p>
          <p className="text-2xl font-bold text-green-900">{completedCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4 shadow-sm">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-sm text-blue-700">Total Revenue</p>
          <p className="text-xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'ALL' || dateFilter !== 'ALL'
              ? 'No transactions match your filters' 
              : 'No transactions found'}
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
                  Cashier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {tx.orderNumber}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {tx.user.username}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(tx.totalPrice)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[tx.status]}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/dashboard/admin/transactions/${tx.id}`}
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
