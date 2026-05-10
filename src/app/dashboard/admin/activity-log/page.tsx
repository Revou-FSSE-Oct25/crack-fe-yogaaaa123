'use client';

import { Suspense } from 'react';
import { ActivityLogTable } from '@/features/activity-log/components/ActivityLogTable';
import { ActivityLogFilters } from '@/features/activity-log/components/ActivityLogFilters';

export default function ActivityLogPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Activity Log</h2>
      
      <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading...</div>}>
        <ActivityLogFilters />
        <ActivityLogTable />
      </Suspense>
    </div>
  );
}
