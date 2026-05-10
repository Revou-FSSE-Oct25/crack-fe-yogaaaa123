'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';
import type { UserRole } from '@/infrastructure/utils/constants';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const adminNavItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: '📊' },
  { label: 'Products', href: '/dashboard/admin/products', icon: '📦' },
  { label: 'Categories', href: '/dashboard/admin/categories', icon: '🏷️' },
  { label: 'Suppliers', href: '/dashboard/admin/suppliers', icon: '🤝' },
  { label: 'Purchase Orders', href: '/dashboard/admin/purchase-orders', icon: '📥' },
  { label: 'Returns', href: '/dashboard/admin/returns', icon: '↩️' },
  { label: 'Transactions', href: '/dashboard/admin/transactions', icon: '💰' },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: '📈' },
  { label: 'Inventory', href: '/dashboard/admin/inventory', icon: '📋' },
  { label: 'Employees', href: '/dashboard/admin/employees', icon: '👥' },
  { label: 'Activity Log', href: '/dashboard/admin/activity-log', icon: '📜' },
  { label: 'AI Product Input', href: '/dashboard/admin/ai-product', icon: '🤖' },
];

const cashierNavItems: NavItem[] = [
  { label: 'POS', href: '/dashboard/cashier', icon: '🛒' },
  { label: 'Transaction History', href: '/dashboard/cashier/transactions', icon: '📜' },
];

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === 'ADMIN' ? adminNavItems : cashierNavItems;
  const logout = useLogoutMutation();

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex h-16 items-center gap-2 border-b bg-white px-5 shadow-sm">
        <span className="text-2xl">💎</span>
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-lg font-bold text-transparent">
          CrackPOS
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t bg-white px-5 py-4 shadow-inner">
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:shadow-sm disabled:opacity-50"
        >
          <span>🚪</span>
          {logout.isPending ? 'Logging out...' : 'Logout'}
        </button>
        <p className="mt-2 text-xs font-medium text-slate-500">
          {role === 'ADMIN' ? '👑 Admin Panel' : '💰 Cashier Terminal'}
        </p>
      </div>
    </aside>
  );
}
