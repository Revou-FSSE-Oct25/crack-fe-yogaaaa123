'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export function useSalesOrderDetail(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => apiClient<any>(`/sales/${id}`),
    enabled: !!id,
  });
}
