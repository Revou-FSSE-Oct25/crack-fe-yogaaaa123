'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import type { PurchaseOrder, PurchaseOrderQueryParams } from '../types';

export function usePurchaseOrders() {
  const searchParams = useSearchParams();

  const params: PurchaseOrderQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || 20,
    search: searchParams.get('search') ?? undefined,
    status: (searchParams.get('status') as PurchaseOrderQueryParams['status']) ?? undefined,
  };

  const take = params.perPage ?? 20;
  const skip = ((params.page ?? 1) - 1) * take;

  const qs = new URLSearchParams();
  qs.set('skip', String(skip));
  qs.set('take', String(take));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);

  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: () => apiClient<PurchaseOrder[]>(`/purchase-orders?${qs.toString()}`),
  });
}
