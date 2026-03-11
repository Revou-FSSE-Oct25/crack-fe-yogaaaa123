'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { StockMovement } from '../schemas/inventorySchema';

// ============================================================================
// useStockMovements
// Fetches the history of goods entering and leaving the warehouse
// ============================================================================

export function useStockMovements() {
  return useQuery({
    queryKey: ['inventory', 'movements'],
    queryFn: () => apiClient<StockMovement[]>('/inventory/movements'),
  });
}
