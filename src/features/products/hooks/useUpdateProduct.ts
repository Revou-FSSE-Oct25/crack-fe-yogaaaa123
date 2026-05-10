'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Product } from '../types';
import type { UpdateProductInput } from '../schemas/productSchema';
import { transformProductToApi } from '../schemas/productSchema';

// ---
// useUpdateProduct — Hook buat update data produk.
// ---

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductInput) =>
      apiClient<Product>(
        `/products/${id}`,
        { method: 'PATCH', body: JSON.stringify(transformProductToApi(data)) }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productDetail(id) });
    },
  });
}
