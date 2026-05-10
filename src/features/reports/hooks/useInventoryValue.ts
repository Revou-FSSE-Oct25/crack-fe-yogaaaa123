'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export interface InventoryValue {
  totalStockItems: number;
}

export function useInventoryValue() {
  return useQuery({
    queryKey: ['reports', 'inventory-value'],
    queryFn: () => apiClient<InventoryValue>('/dashboard/inventory-value'),
  });
}
