import type { Metadata } from 'next';
import { TenantDetail } from '@/features/admin/components/TenantDetail';

export const metadata: Metadata = {
  title: 'Tenant Detail — Super Admin',
};

export default function TenantDetailPage() {
  return <TenantDetail />;
}
