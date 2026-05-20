'use client';

import { Suspense } from 'react';
import { ProfitLossReportView } from '@/features/reports/components/ProfitLossReportView';

export default function ProfitLossReportPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-gray-400">Loading...</div>}>
      <ProfitLossReportView />
    </Suspense>
  );
}
