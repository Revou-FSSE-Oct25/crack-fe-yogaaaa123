'use client';

import { useState } from 'react';
import { useActivityLog } from '../hooks/useActivityLog';
import type { ActivityLogEntry } from '../types';

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
    return <div className="py-12 text-center text-gray-400">Loading activity log...</div>;
  }

  const logs = data?.data ?? [];

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">No activity recorded</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Action
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Entity Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {logs.map((log) => (
            <>
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {new Date(log.createdAt).toLocaleString('id-ID')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {log.userName}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${actionColors[log.action]}`}>
                    {log.action}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {log.entity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {log.details ? (
                    <button
                      onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {expandedRow === log.id ? 'Hide' : 'Show'} details
                    </button>
                  ) : (
                    <span className="text-gray-400">No details</span>
                  )}
                </td>
              </tr>
              {expandedRow === log.id && log.details && (
                <tr>
                  <td colSpan={5} className="bg-gray-50 px-6 py-4">
                    <pre className="overflow-x-auto text-xs text-gray-700">
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
