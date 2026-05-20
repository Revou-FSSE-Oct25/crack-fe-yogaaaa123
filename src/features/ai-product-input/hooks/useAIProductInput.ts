import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

interface AIProductInputData {
  image: File;
}

export interface AIProductItem {
  id: string; // Temporary ID for frontend keying
  name: string;
  sku?: string; // Make SKU optional as it might not be in every receipt
  price: number;
  quantity: number;
  categoryName?: string;
  supplierName?: string;
}

export type AIProductResponse = AIProductItem[];

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
