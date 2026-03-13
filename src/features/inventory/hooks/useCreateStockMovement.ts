'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { CreateStockMovementInput, StockMovement } from '../schemas/inventorySchema';

// ---
// useCreateStockMovement
// Mutation hook to record a Stock In or Stock Out action
// ---

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockMovementInput) =>
      apiClient<StockMovement>('/inventory/movements', {
        method: 'POST',
        body: JSON.stringify(data),
      }, true), // true marks it as idempotent
    
    onSuccess: () => {
      // Invalidate both movements and products so the stock numbers update everywhere
      queryClient.invalidateQueries({ queryKey: ['inventory', 'movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
