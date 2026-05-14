'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Transaction } from '../types';

export function useTransaction(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.transactionDetail(id),
    queryFn: () => apiClient<Transaction>(`/sales/${id}`),
    enabled: !!id,
  });
}
