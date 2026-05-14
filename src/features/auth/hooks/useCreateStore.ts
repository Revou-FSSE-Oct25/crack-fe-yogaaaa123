import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';

interface CreateStoreRequest {
  storeName: string;
  address: string;
  phone: string;
}

interface CreateStoreResponse {
  message: string;
  tenant: {
    id: string;
    storeName: string;
  };
}

export function useCreateStore() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: CreateStoreRequest) => {
      return await apiClient.post<CreateStoreResponse>('/auth/create-store', data);
    },
    onSuccess: () => {
      router.push('/admin/dashboard');
    },
  });
}
