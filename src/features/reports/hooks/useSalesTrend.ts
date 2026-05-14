'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export interface SalesTrendItem {
  date: string;
  totalSales: number;
  totalRevenue: number;
}

export function useSalesTrend(days = 7) {
  return useQuery({
    queryKey: ['reports', 'sales-trend', days],
    queryFn: () => apiClient<SalesTrendItem[]>(`/dashboard/sales-trend?days=${days}`),
  });
}
