'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { PurchaseOrder } from '../types';

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: () => apiClient<PurchaseOrder>(`/purchase/${id}`),
    enabled: !!id,
  });
}
