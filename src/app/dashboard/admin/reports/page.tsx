'use client';

import Link from 'next/link';

const reports = [
  {
    title: 'Sales Report',
    description: 'View sales transactions, revenue, and profit analysis',
    icon: '💰',
    href: '/dashboard/admin/reports/sales',
    color: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Inventory Report',
    description: 'Check stock levels, product values, and inventory status',
    icon: '📦',
    href: '/dashboard/admin/reports/inventory',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Profit & Loss Report',
    description: 'Analyze income, expenses, and net profit',
    icon: '📊',
    href: '/dashboard/admin/reports/profit-loss',
    color: 'from-purple-500 to-pink-600',
  },
];

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
        <p className="mt-2 text-gray-600">
          Generate and export various business reports
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${report.color} opacity-5 transition-opacity group-hover:opacity-10`} />
            
            <div className="relative">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${report.color} text-3xl shadow-md`}>
                {report.icon}
              </div>
              
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {report.title}
              </h3>
              
              <p className="text-sm text-gray-600">
                {report.description}
              </p>
              
              <div className="mt-4 flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                View Report
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
