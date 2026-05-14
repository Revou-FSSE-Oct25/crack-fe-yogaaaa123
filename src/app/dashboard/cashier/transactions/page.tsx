'use client';

import { TransactionList } from '@/features/transactions/components/TransactionList';

export default function CashierTransactionsPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Transaction History</h2>
      <TransactionList />
    </div>
  );
}
