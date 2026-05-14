'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { PaginatedResponse } from '@/infrastructure/api/types';
import type { Category } from '../types';

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: () => apiClient<PaginatedResponse<Category>>('/categories'),
  });
}
