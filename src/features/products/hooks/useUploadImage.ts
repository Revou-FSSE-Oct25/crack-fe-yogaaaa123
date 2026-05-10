'use client';

import { useMutation } from '@tanstack/react-query';

interface UploadImageResponse {
  url: string;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadImageResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
      const response = await fetch(`${baseUrl}/upload/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message || 'Failed to upload image');
      }

      const result = await response.json();
      // BE returns { statusCode, message, data: { url }, timestamp }
      return result.data || result;
    },
  });
}
