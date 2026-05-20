'use client';

import { Suspense } from 'react';
import { SalesReportView } from '@/features/reports/components/SalesReportView';

export default function SalesReportPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-gray-400">Loading...</div>}>
      <SalesReportView />
    </Suspense>
  );
}
