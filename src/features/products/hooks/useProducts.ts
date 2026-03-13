'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Product, ProductQueryParams } from '../types';

// ---
// useProducts — URL-Driven product list query
// Reads page/search/sort from URL params, so the NestJS backend receives identical
// query strings that it can bind directly into SQL queries.
// ---

export function useProducts() {
  const searchParams = useSearchParams();

  const params: ProductQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || 20,
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    sort: (searchParams.get('sort') as ProductQueryParams['sort']) ?? undefined,
  };

  // Build a clean query string
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) qs.set(key, String(value));
  });

  return useQuery({
    queryKey: [...QUERY_KEYS.products, params],
    queryFn: () => apiClient<Product[]>(`/products?${qs.toString()}`),
  });
}
