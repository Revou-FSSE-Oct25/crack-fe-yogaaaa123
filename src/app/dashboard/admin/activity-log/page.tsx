'use client';

import { Suspense } from 'react';
import { ActivityLogTable } from '@/features/activity-log/components/ActivityLogTable';
import { ActivityLogFilters } from '@/features/activity-log/components/ActivityLogFilters';

export default function ActivityLogPage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Activity Log</h2>
        <p className="mt-1 text-sm text-slate-500">Track all changes made across your store</p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading...</div>}>
        <ActivityLogFilters />
        <ActivityLogTable />
      </Suspense>
    </div>
  );
}
