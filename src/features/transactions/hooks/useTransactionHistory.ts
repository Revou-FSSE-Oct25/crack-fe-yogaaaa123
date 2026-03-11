'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { TransactionHistory } from '../schemas/historySchema';

// ============================================================================
// useTransactionHistory
// Fetches the transaction ledger (cashier sales) for the admin dashboard
// ============================================================================

export function useTransactionHistory() {
  return useQuery({
    queryKey: ['transactions', 'history'],
    queryFn: () => apiClient<TransactionHistory[]>('/transactions/history'),
  });
}
