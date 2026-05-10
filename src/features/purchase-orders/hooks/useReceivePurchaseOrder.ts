'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { PurchaseOrder } from '../types';

export function useReceivePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<PurchaseOrder>(
        `/purchase-orders/${id}/receive`,
        { method: 'POST' },
        true, // idempotent
      ),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-orders', id] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}
