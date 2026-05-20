import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReturnList } from './ReturnList';
import { useReturns } from '../hooks/useReturns';
import { useUpdateReturnStatus } from '../hooks/useUpdateReturnStatus';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

vi.mock('../hooks/useReturns');
vi.mock('../hooks/useUpdateReturnStatus');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ReturnList Component', () => {
  const mockMutateStatus = vi.fn();

  beforeEach(() => {
    vi.mocked(useReturns).mockReturnValue({
      data: {
        data: [
          {
            id: 'ret-1',
            salesOrder: { orderNumber: 'SO-001' },
            totalRefund: 50000,
            reason: 'Damaged',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      isLoading: false,
    } as any);

    vi.mocked(useUpdateReturnStatus).mockReturnValue({
      mutate: mockMutateStatus,
      isPending: false,
    } as any);
  });

  it('should render returns table', () => {
    render(<ReturnList />, { wrapper: createWrapper() });
    expect(screen.getByText('SO-001')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('should open modal and call update status on approve', async () => {
    render(<ReturnList />, { wrapper: createWrapper() });

    // Click Review
    fireEvent.click(screen.getByText('Review'));

    // Modal should be open
    expect(screen.getByText('Review Sales Return')).toBeInTheDocument();
    expect(screen.getByText('"Damaged"')).toBeInTheDocument();

    // Click Approve
    fireEvent.click(screen.getByText('Approve Return'));

    expect(mockMutateStatus).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'ret-1', status: 'APPROVED' }),
      expect.any(Object)
    );
  });
});
