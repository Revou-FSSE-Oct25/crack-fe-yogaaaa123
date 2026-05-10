'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export interface AdjustStockInput {
  productId: string;
  quantityChange: number;
  type: 'ADJUSTMENT' | 'DAMAGED' | 'LOST' | 'FOUND' | 'MANUAL';
  notes?: string;
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdjustStockInput) =>
      apiClient('/inventory/adjust', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
