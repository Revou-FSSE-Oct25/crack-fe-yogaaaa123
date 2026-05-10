'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';

export interface DashboardStats {
  totalProducts: number;
  totalProductsInStock: number;
  totalSuppliers: number;
  totalCategories: number;
  today: { revenue: number | string; profit: number | string };
  thisMonth: { revenue: number | string; profit: number | string };
  allTimeRevenue: number | string;
  lowStockProducts: {
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
    reorderLevel: number;
  }[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [...QUERY_KEYS.reports, 'dashboard'],
    queryFn: () => apiClient<DashboardStats>('/dashboard/summary'),
  });
}
