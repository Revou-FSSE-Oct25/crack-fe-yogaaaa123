'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { SalesOrder } from '../types';

export function useSalesOrders() {
  return useQuery({
    queryKey: [...QUERY_KEYS.sales, 'history'],
    queryFn: () => apiClient<SalesOrder[]>('/sales'),
  });
}
