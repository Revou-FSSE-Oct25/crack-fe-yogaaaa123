'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Product } from '../types';
import type { CreateProductInput } from '../schemas/productSchema';

// ============================================================================
// useCreateProduct — Mutation with automatic cache invalidation
// Uses idempotency key to prevent duplicate product creation.
// ============================================================================

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      apiClient<Product>(
        '/products',
        { method: 'POST', body: JSON.stringify(data) },
        true, // idempotent — generates Idempotency-Key header
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}
