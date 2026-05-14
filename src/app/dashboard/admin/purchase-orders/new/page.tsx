'use client';

import { CreatePurchaseOrderForm } from '@/features/purchase-orders/components/CreatePurchaseOrderForm';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';

export default function NewPurchaseOrderPage() {
  const { data: suppliersData, isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () =>
      apiClient<{ data: Array<{ id: string; name: string }> }>('/suppliers'),
  });

  const suppliers = suppliersData?.data ?? [];

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Create Purchase Order</h2>
      <CreatePurchaseOrderForm suppliers={suppliers} />
    </div>
  );
}
