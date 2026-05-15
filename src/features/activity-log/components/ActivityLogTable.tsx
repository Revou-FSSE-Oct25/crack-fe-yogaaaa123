'use client';

import { useState } from 'react';
import { useActivityLog } from '../hooks/useActivityLog';
import type { ActivityLogEntry } from '../types';
import { ScrollText } from 'lucide-react';

const actionColors: Record<ActivityLogEntry['action'], string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  LOGIN: 'bg-purple-100 text-purple-800',
  LOGOUT: 'bg-gray-100 text-gray-800',
};

export function ActivityLogTable() {
  const { data, isLoading } = useActivityLog();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-slate-500">Loading activity log...</p>
      </div>
    );
  }

  const logs = data?.data ?? [];

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white p-12 text-center shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <ScrollText className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No activity recorded</p>
        <p className="mt-1 text-xs text-slate-400">Actions will appear here once you start making changes</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Timestamp
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Action
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Entity
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => (
            <>
              <tr key={log.id} className="transition-colors hover:bg-slate-50/50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                  {new Date(log.createdAt).toLocaleString('id-ID')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {log.user?.username || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    actionColors[log.action] ?? 'bg-slate-100 text-slate-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {log.entity}
                </td>
                <td className="px-6 py-4 text-sm">
                  {log.details ? (
                    <button
                      onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {expandedRow === log.id ? 'Hide' : 'View'} Details
                    </button>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              </tr>
              {expandedRow === log.id && log.details && (
                <tr key={`${log.id}-meta`}>
                  <td colSpan={5} className="bg-slate-50/50 px-6 py-4">
                    <pre className="max-h-48 overflow-y-auto rounded-xl bg-white p-3 text-xs text-slate-600 shadow-sm">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
