'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { SalesReturn } from '../types';
import type { PaginatedResponse } from '@/infrastructure/api/types';

export function useReturns() {
  return useQuery({
    queryKey: ['returns'],
    queryFn: () => apiClient<PaginatedResponse<SalesReturn>>('/returns'),
  });
}
