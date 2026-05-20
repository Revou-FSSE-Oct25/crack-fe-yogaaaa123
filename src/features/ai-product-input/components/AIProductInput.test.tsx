import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AIProductInput } from './AIProductInput';
import { useAIProductInput } from '../hooks/useAIProductInput';
import { useProcessAiBatch } from '../hooks/useProcessAiBatch';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

vi.mock('../hooks/useAIProductInput');
vi.mock('../hooks/useProcessAiBatch');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('AIProductInput Component', () => {
  const mockMutateAI = vi.fn();
  const mockMutateBatch = vi.fn();

  beforeEach(() => {
    vi.mocked(useAIProductInput).mockReturnValue({
      mutate: mockMutateAI,
      isPending: false,
      isError: false,
      isSuccess: false,
    } as any);

    vi.mocked(useProcessAiBatch).mockReturnValue({
      mutate: mockMutateBatch,
      isPending: false,
      isError: false,
      isSuccess: false,
    } as any);
  });

  it('should render upload step initially', () => {
    const { container } = render(<AIProductInput />, { wrapper: createWrapper() });
    expect(screen.getByText(/AI Product Input from Receipt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Receipt Image/i)).toBeInTheDocument();
  });

  it('should transition to audit step after successful upload', async () => {
    // Mock successful upload
    vi.mocked(useAIProductInput).mockReturnValue({
      mutate: (data: any, options: any) => {
        options.onSuccess([{ id: '1', name: 'Product A', price: 100, quantity: 2 }]);
      },
      isPending: false,
      isError: false,
      isSuccess: true,
    } as any);

    const { container } = render(<AIProductInput />, { wrapper: createWrapper() });

    // Mock file selection
    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/Receipt Image/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Click process
    const form = container.querySelector('form');
    if (form) fireEvent.submit(form);

    // Should see audit table
    expect(await screen.findByText(/Audit Extracted Products/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Product A')).toBeInTheDocument();
  });
});
