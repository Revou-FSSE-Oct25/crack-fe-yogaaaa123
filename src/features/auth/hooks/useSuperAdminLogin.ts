import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { adminApiClient } from '@/infrastructure/api/adminClient';
import type { LoginCredentials, LoginResponse } from '../types';

export function useSuperAdminLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return adminApiClient.post<LoginResponse>('/auth/login', credentials);
    },
    onSuccess: () => {
      router.push('/super-admin/dashboard');
    },
  });
}
