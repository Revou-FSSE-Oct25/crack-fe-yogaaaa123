'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/infrastructure/utils/constants';

// ---
// useInventorySync — Real-time inventory sync hook
// Polling-based approach untuk sinkronasi stok antar terminal.
// Bisa diganti pakai WebSocket nanti kalau backend udah support.
// ---

interface UseInventorySyncOptions {
  /** Interval polling dalam ms (default: 30000 = 30 detik) */
  intervalMs?: number;
}

export function useInventorySync(options: UseInventorySyncOptions = {}) {
  const { intervalMs = 30000 } = options;
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Invalidate products query setiap intervalMs untuk refresh data stok
    intervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [queryClient, intervalMs]);
}
