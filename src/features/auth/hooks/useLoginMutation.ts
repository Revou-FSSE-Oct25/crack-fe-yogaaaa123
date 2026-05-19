'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { resetCsrfToken } from '@/infrastructure/api/csrf';
import { ROLE_HOME } from '@/infrastructure/utils/constants';
import type { LoginCredentials, LoginResponse } from '../types';

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      

      return response;
    },

    onSuccess: (response) => {
      resetCsrfToken();
      const { role } = response.user;
      router.push(ROLE_HOME[role]);
      router.refresh();
    },
  });
}
