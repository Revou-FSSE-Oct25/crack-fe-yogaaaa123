import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { AIProductItem } from './useAIProductInput';
import { useRouter } from 'next/navigation';

interface ProcessAiBatchResponse {
  processed: number;
  created: number;
  updated: number;
  warnings: string[];
  errors: string[];
}

export function useProcessAiBatch() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (items: AIProductItem[]) => {
      return apiClient.post<ProcessAiBatchResponse>('/inventory/ai-input', { items });
    },
    onSuccess: () => {
      router.push('/dashboard/admin/inventory'); // Redirect to inventory after successful batch process
      router.refresh();
    },
  });
}
