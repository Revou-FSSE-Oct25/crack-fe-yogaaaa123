import { useQuery } from '@tanstack/react-query';
import { adminApiClient } from '@/infrastructure/api/adminClient';

interface TenantDetail {
  id: string;
  name: string;
  slug: string;
  slugPrefix: string;
  createdAt: string;
  stats: {
    _count: {
      products: number;
      salesOrders: number;
      users: number;
    };
  };
  owners: Array<{
    id: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  }>;
}

export function useTenantDetail(tenantId: string) {
  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => adminApiClient.get<TenantDetail>(`/admin/tenants/${tenantId}`),
    enabled: !!tenantId,
  });
}
