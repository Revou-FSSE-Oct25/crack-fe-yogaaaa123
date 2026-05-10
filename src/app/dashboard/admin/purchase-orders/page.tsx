'use client';

import { Suspense } from 'react';
import { PurchaseOrderList } from '@/features/purchase-orders/components/PurchaseOrderList';

export default function PurchaseOrdersPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading...</div>}>
      <PurchaseOrderList />
    </Suspense>
  );
}
