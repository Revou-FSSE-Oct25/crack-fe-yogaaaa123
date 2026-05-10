import type { Metadata } from 'next';
import { TenantsList } from '@/features/admin/components/TenantsList';

export const metadata: Metadata = {
  title: 'Tenants — Super Admin',
};

export default function TenantsPage() {
  return <TenantsList />;
}
