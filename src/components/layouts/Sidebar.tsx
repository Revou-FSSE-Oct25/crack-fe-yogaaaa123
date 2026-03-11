'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@/infrastructure/utils/constants';

// ============================================================================
// Sidebar — Dashboard navigation, dynamically rendered per role
// ============================================================================

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const adminNavItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: '📊' },
  { label: 'Products', href: '/dashboard/admin/products', icon: '📦' },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: '📈' },
];

const cashierNavItems: NavItem[] = [
  { label: 'POS', href: '/dashboard/cashier', icon: '🛒' },
  { label: 'Transactions', href: '/dashboard/cashier/transaction', icon: '🧾' },
];

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === 'ADMIN' ? adminNavItems : cashierNavItems;

  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
        <span className="text-xl">💎</span>
        <span className="text-lg font-bold text-gray-900">CrackPOS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-xs text-gray-400">
          {role === 'ADMIN' ? 'Admin Panel' : 'Cashier Terminal'}
        </p>
      </div>
    </aside>
  );
}
