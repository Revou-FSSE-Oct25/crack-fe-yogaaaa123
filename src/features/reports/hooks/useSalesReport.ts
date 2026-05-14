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
    queryFn: () => apiClient<{ data: SalesReportItem[]; summary: { totalSales: number; totalProfit: number } }>(`/reports/sales?${qs.toString()}`),
  });
}
