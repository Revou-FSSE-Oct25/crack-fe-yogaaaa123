import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

interface AIProductInputData {
  image: File;
}

interface AIProductResponse {
  name: string;
  sku: string;
  price: number;
  stock: number;
  categoryName: string;
  supplierName: string;
}

export function useAIProductInput() {
  return useMutation({
    mutationFn: async (data: AIProductInputData) => {
      const formData = new FormData();
      formData.append('image', data.image);
      
      return apiClient.post<AIProductResponse>('/inventory/ai-product-input', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  });
}
