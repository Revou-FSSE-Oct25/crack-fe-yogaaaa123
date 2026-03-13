'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';
import { ROLE_HOME } from '@/infrastructure/utils/constants';
import type { LoginCredentials, LoginResponse } from '../types';

// ---
// useLoginMutation
// Posts credentials → receives JWT + user profile → redirects by role
// ---

export function useLoginMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    onSuccess: (response) => {
      // 🚨 TEMPORARY MOCK COOKIE SETTER 🚨
      document.cookie = `auth_token=${response.data.token}; path=/; max-age=86400; samesite=lax`;
      
      const { role } = response.data.user;
      router.push(ROLE_HOME[role]);
      router.refresh();
    },
  });
}
