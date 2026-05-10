import type { Metadata } from 'next';
import { SuperAdminDashboard } from '@/features/admin/components/SuperAdminDashboard';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard — CrackPOS',
};

export default function SuperAdminDashboardPage() {
  return <SuperAdminDashboard />;
}
