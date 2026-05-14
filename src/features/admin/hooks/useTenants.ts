import { useQuery } from '@tanstack/react-query';
import { adminApiClient } from '@/infrastructure/api/adminClient';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  slugPrefix: string;
  createdAt: string;
  _count: {
    salesOrders: number;
  };
}

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => adminApiClient.get<Tenant[]>('/admin/tenants'),
  });
}
