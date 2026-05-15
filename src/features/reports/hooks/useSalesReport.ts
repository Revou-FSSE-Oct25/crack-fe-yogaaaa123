'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';

interface SalesReportItem {
  date: string;
  orderNumber: string;
  totalAmount: number;
  profit: number;
  status: string;
}

export function useSalesReport() {
  const searchParams = useSearchParams();
  
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';
  const status = searchParams.get('status') ?? '';

  const qs = new URLSearchParams();
  if (startDate) qs.set('startDate', startDate);
  if (endDate) qs.set('endDate', endDate);
  if (status) qs.set('status', status);

  return useQuery({
    queryKey: ['sales-report', startDate, endDate, status],
    queryFn: async () => {
      const res = await apiClient<{
        orders: Array<{
          orderNumber: string;
          totalPrice: string;
          totalProfit: string;
          status: string;
          createdAt: string;
        }>;
        summary: { totalRevenue: number; totalProfit: number };
      }>(`/reports/sales?${qs.toString()}`);

      return {
        data: res.orders.map((o) => ({
          date: o.createdAt,
          orderNumber: o.orderNumber,
          totalAmount: Number(o.totalPrice),
          profit: Number(o.totalProfit),
          status: o.status,
        })),
        summary: { totalSales: res.summary.totalRevenue, totalProfit: res.summary.totalProfit },
      };
    },
  });
}
