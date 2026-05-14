'use client';

import { use } from 'react';
import { PurchaseOrderDetail } from '@/features/purchase-orders/components/PurchaseOrderDetail';

export default function PurchaseOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return <PurchaseOrderDetail id={id} />;
}
