'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Product } from '../types';
import type { CreateProductInput } from '../schemas/productSchema';
import { transformProductToApi } from '../schemas/productSchema';

// ---
// useCreateProduct — Hook buat nambah produk baru.
// Otomatis hapus cache produk lama dan fetch ulang (invalidateQueries) tiap kali sukses,
// biar list produk di UI langsung update tanpa perlu direfresh manual.
// ---

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductInput) =>
      apiClient<Product>(
        '/products',
        { method: 'POST', body: JSON.stringify(transformProductToApi(data)) },
        true, // idempotent — generates Idempotency-Key header
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    },
  });
}
