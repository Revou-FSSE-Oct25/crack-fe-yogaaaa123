'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import { useCartStore } from '../store/useCartStore';
import type { Transaction, CreateTransactionPayload } from '../types';

// ============================================================================
// useCreateTransaction — Checkout mutation
// 1. Builds the payload from the Zustand cart
// 2. Posts with an Idempotency-Key to prevent double-charging
// 3. Clears the cart and refreshes product stock on success
// ============================================================================

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: () => {
      const items = useCartStore.getState().items;

      const payload: CreateTransactionPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.cartQuantity,
        })),
      };

      return apiClient<Transaction>(
        '/transactions',
        { method: 'POST', body: JSON.stringify(payload) },
        true, // idempotent — attach Idempotency-Key header
      );
    },

    onSuccess: () => {
      // Empty cart after successful checkout
      clearCart();

      // Refresh product stock and transaction history
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
    },
  });
}
