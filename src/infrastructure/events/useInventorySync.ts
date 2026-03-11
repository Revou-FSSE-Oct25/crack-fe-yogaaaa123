'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// ============================================================================
// Real-Time Inventory Synchronization via SSE
// Listens to backend-pushed events and automatically invalidates stale caches.
// ============================================================================

/**
 * Hook that opens a Server-Sent Events connection to the NestJS backend.
 * When a 'STOCK_UPDATED' event fires (e.g. after another cashier completes a
 * sale), TanStack Query silently re-fetches the product list in the background,
 * preventing overselling across multiple terminals.
 */
export function useInventorySync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    const eventSource = new EventSource(`${apiUrl}/events/inventory`);

    eventSource.addEventListener('STOCK_UPDATED', () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    });

    eventSource.addEventListener('TRANSACTION_CREATED', () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    });

    eventSource.onerror = () => {
      // SSE will auto-reconnect; log for observability
      console.warn('[SSE] Inventory sync connection interrupted — reconnecting…');
    };

    return () => eventSource.close();
  }, [queryClient]);
}
