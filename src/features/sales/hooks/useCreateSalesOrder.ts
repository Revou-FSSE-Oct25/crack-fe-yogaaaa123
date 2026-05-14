'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import { useCartStore } from '../store/useCartStore';
import type { SalesOrder, CreateSalesOrderPayload } from '../types';

export function useCreateSalesOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: () => {
      const items = useCartStore.getState().items;

      const payload: CreateSalesOrderPayload = {
        orderNumber: `SO-${Date.now()}`,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.cartQuantity,
          unitPrice: String(item.price),
        })),
      };

      return apiClient<SalesOrder>(
        '/sales',
        { method: 'POST', body: JSON.stringify(payload) },
        true,
      );
    },

    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sales });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      router.push('/dashboard/cashier/transactions');
      router.refresh();
    },
  });
}
