'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

interface NotifItem {
  id: string;
  type: 'low_stock' | 'pending_po' | 'pending_return';
  label: string;
  description: string;
  href: string;
}

interface NotifResult {
  total: number;
  items: NotifItem[];
}

export function useNotifications() {
  const lowStock = useQuery({
    queryKey: ['notifications', 'low-stock'],
    queryFn: () => apiClient<{ id: string; name: string; stockQuantity: number; reorderLevel: number }[]>('/inventory/low-stock'),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const pendingPO = useQuery({
    queryKey: ['notifications', 'pending-po'],
    queryFn: () => apiClient<{ id: string; status?: string }[]>('/purchase'),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const pendingReturns = useQuery({
    queryKey: ['notifications', 'pending-returns'],
    queryFn: () => apiClient<{ id: string }[]>('/returns'),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const isLoading = lowStock.isLoading || pendingPO.isLoading || pendingReturns.isLoading;

  const items: NotifItem[] = [];

  if (Array.isArray(lowStock.data)) {
    for (const p of lowStock.data) {
      items.push({
        id: `ls-${p.id}`,
        type: 'low_stock',
        label: p.name,
        description: `Stock: ${p.stockQuantity} (min: ${p.reorderLevel})`,
        href: '/dashboard/admin/inventory',
      });
    }
  }

  const poData = pendingPO.data;
  const poCount = Array.isArray(poData) ? poData.length : 0;
  if (poCount > 0) {
    items.push({
      id: 'pending-po',
      type: 'pending_po',
      label: `${poCount} Pending Purchase Order${poCount > 1 ? 's' : ''}`,
      description: 'Need to be received',
      href: '/dashboard/admin/purchase-orders',
    });
  }

  return {
    total: items.length,
    items,
    isLoading,
  };
}
