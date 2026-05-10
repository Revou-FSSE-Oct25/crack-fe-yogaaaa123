'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { Product, ProductQueryParams } from '../types';
import type { PaginatedResponse } from '@/infrastructure/api/types';

export function useProducts() {
  const searchParams = useSearchParams();

  const params: ProductQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || 12,
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
  };

  const take = params.perPage ?? 12;
  const skip = ((params.page ?? 1) - 1) * take;

  const qs = new URLSearchParams();
  qs.set('skip', String(skip));
  qs.set('take', String(take));
  if (params.search) qs.set('search', params.search);
  if (params.categoryId) qs.set('categoryId', params.categoryId);

  return useQuery({
    queryKey: [...QUERY_KEYS.products, params],
    queryFn: () => apiClient<PaginatedResponse<Product>>(`/products?${qs.toString()}`),
  });
}
