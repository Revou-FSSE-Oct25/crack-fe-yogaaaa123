'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Transaction, TransactionQueryParams } from '../types';

export function useTransactions() {
  const searchParams = useSearchParams();

  const params: TransactionQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || 20,
    search: searchParams.get('search') ?? undefined,
    status: (searchParams.get('status') as TransactionQueryParams['status']) ?? undefined,
  };

  const take = params.perPage ?? 20;
  const skip = ((params.page ?? 1) - 1) * take;

  const qs = new URLSearchParams();
  qs.set('skip', String(skip));
  qs.set('take', String(take));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);

  return useQuery({
    queryKey: [...QUERY_KEYS.transactions, params],
    queryFn: async () => {
      const response = await apiClient<Transaction[]>(`/sales?${qs.toString()}`);
      console.log('Transactions fetched:', response);
      return response;
    },
    refetchOnWindowFocus: true, // Auto-refetch when window gains focus
    staleTime: 0, // Always consider data stale, so it refetches
  });
}
