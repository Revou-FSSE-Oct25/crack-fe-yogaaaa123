'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  reorderLevel: number;
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ['inventory', 'low-stock'],
    queryFn: () => apiClient<LowStockProduct[]>('/inventory/low-stock'),
  });
}
