'use client';

import { Suspense } from 'react';
import { InventoryReportView } from '@/features/reports/components/InventoryReportView';

export default function InventoryReportPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-gray-400">Loading...</div>}>
      <InventoryReportView />
    </Suspense>
  );
}
