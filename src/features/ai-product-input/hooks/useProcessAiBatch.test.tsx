import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProcessAiBatch } from './useProcessAiBatch';
import { apiClient } from '@/infrastructure/api/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const mockPost = vi.fn();
vi.mock('@/infrastructure/api/client', () => ({
  apiClient: {
    post: (...args: any[]) => mockPost(...args),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { 
      queries: { retry: false }, 
      mutations: { retry: false } 
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProcessAiBatch', () => {
  it('should call apiClient.post with items', async () => {
    const mockItems = [{ id: '1', name: 'P1', price: 10, quantity: 1 }];
    mockPost.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useProcessAiBatch(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate(mockItems as any);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).toHaveBeenCalledWith('/inventory/ai-input', { items: mockItems });
  });
});
