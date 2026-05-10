'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export interface TopProduct {
  productName: string;
  totalSold: number;
  revenue: number;
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['reports', 'top-products', limit],
    queryFn: () => apiClient<TopProduct[]>(`/dashboard/top-products?limit=${limit}`),
  });
}
