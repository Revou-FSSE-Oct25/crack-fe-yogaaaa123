'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';
import type { SalesReturn } from '../types';
import type { CreateReturnFormInput } from '../schemas/createReturnSchema';
import { transformReturnToApi } from '../schemas/createReturnSchema';

export function useCreateReturn() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateReturnFormInput) =>
      apiClient<SalesReturn>(
        '/returns',
        { method: 'POST', body: JSON.stringify(transformReturnToApi(data)) },
        true, // idempotent
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sales });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      router.push('/dashboard/admin/returns');
    },
  });
}
