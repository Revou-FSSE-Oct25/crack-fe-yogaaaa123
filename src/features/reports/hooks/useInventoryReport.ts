'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';

interface InventoryReportItem {
  productName: string;
  sku: string;
  stock: number;
  value: number;
  category: string;
}

export function useInventoryReport() {
  const searchParams = useSearchParams();
  
  const categoryId = searchParams.get('categoryId') ?? '';
  const lowStock = searchParams.get('lowStock') ?? '';

  const qs = new URLSearchParams();
  if (categoryId) qs.set('categoryId', categoryId);
  if (lowStock) qs.set('lowStock', lowStock);

  return useQuery({
    queryKey: ['inventory-report', categoryId, lowStock],
    queryFn: () => apiClient<{ data: InventoryReportItem[]; summary: { totalValue: number; totalItems: number } }>(`/reports/inventory?${qs.toString()}`),
  });
}
