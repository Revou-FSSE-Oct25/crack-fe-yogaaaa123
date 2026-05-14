'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { PurchaseOrder } from '../types';
import type { CreatePurchaseOrderFormInput } from '../schemas/createPurchaseOrderSchema';
import { transformPurchaseOrderToApi } from '../schemas/createPurchaseOrderSchema';

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreatePurchaseOrderFormInput) =>
      apiClient<PurchaseOrder>(
        '/purchase',
        { method: 'POST', body: JSON.stringify(transformPurchaseOrderToApi(data)) },
        true, // idempotent
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      router.push('/dashboard/admin/purchase-orders');
    },
  });
}
