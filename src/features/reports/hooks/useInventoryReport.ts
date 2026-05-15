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
    queryFn: async () => {
      const res = await apiClient<{
        products: Array<{
          name: string;
          sku: string;
          stockQuantity: number;
          price: string;
          category: { name: string };
        }>;
        summary: { totalProducts: number; totalStock: number };
      }>(`/reports/inventory?${qs.toString()}`);

      return {
        data: res.products.map((p) => ({
          productName: p.name,
          sku: p.sku,
          stock: p.stockQuantity,
          value: p.stockQuantity * Number(p.price),
          category: p.category.name,
        })),
        summary: {
          totalValue: res.products.reduce((sum, p) => sum + p.stockQuantity * Number(p.price), 0),
          totalItems: res.summary.totalProducts,
        },
      };
    },
  });
}
