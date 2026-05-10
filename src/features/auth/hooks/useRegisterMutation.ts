'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { resetCsrfToken } from '@/infrastructure/api/csrf';
import type { RegisterInput } from '../schemas/registerSchema';

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      resetCsrfToken();
      router.push('/login?registered=true');
    },
  });
}
