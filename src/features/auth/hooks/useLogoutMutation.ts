'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { resetCsrfToken } from '@/infrastructure/api/csrf';

export function useLogoutMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      apiClient<void>('/auth/logout', { method: 'POST' }),

    onSuccess: () => {
      resetCsrfToken();
      router.push('/login');
      router.refresh();
    },
  });
}
