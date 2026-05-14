'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export function useCompleteSalesOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/sales/${id}/complete`, { method: 'PATCH' }),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['sales', id] });
    },
  });
}

export function useCancelSalesOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/sales/${id}/cancel`, { method: 'PATCH' }),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['sales', id] });
    },
  });
}
