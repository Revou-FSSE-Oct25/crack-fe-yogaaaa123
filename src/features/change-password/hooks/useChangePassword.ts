'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import type { ChangePasswordInput } from '../types';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      apiClient<{ message: string }>(
        '/auth/change-password',
        { method: 'PATCH', body: JSON.stringify(data) },
      ),
  });
}
