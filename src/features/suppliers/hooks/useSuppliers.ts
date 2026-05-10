'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { PaginatedResponse } from '@/infrastructure/api/types';
import type { Supplier } from '../types';

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => apiClient<PaginatedResponse<Supplier>>('/suppliers'),
  });
}
