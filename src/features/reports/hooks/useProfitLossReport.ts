'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/infrastructure/api/client';

interface ProfitLossReport {
  income: {
    sales: number;
    other: number;
    total: number;
  };
  expenses: {
    cogs: number;
    purchases: number;
    other: number;
    total: number;
  };
  netProfit: number;
}

export function useProfitLossReport() {
  const searchParams = useSearchParams();
  
  const startDate = searchParams.get('startDate') ?? '';
  const endDate = searchParams.get('endDate') ?? '';

  const qs = new URLSearchParams();
  if (startDate) qs.set('startDate', startDate);
  if (endDate) qs.set('endDate', endDate);

  return useQuery({
    queryKey: ['profit-loss-report', startDate, endDate],
    queryFn: async () => {
      const res = await apiClient<{
        totalRevenue: number;
        totalCogs: number;
        totalProfit: number;
      }>(`/reports/profit-loss?${qs.toString()}`);

      return {
        income: { sales: res.totalRevenue, other: 0, total: res.totalRevenue },
        expenses: { cogs: res.totalCogs, purchases: 0, other: 0, total: res.totalCogs },
        netProfit: res.totalProfit,
      } satisfies ProfitLossReport;
    },
  });
}
