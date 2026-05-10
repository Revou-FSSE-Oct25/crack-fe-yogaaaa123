import { useQuery } from '@tanstack/react-query';
import { adminApiClient } from '@/infrastructure/api/adminClient';

interface PlatformStats {
  platform: {
    totalTenants: number;
    totalUsers: number;
    totalProducts: number;
    totalSalesOrders: number;
    totalPurchaseOrders: number;
    totalReturns: number;
  };
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => adminApiClient.get<PlatformStats>('/admin/stats'),
  });
}
