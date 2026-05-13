'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation';
import type { UserRole } from '@/infrastructure/utils/constants';

import {
  LayoutDashboard,
  Package,
  Tags,
  Handshake,
  ClipboardList,
  Undo2,
  ArrowLeftRight,
  BarChart3,
  Warehouse,
  Users,
  ScrollText,
  Bot,
  ShoppingCart,
  History,
  LogOut,
  Store,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const adminNavItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/dashboard/admin/products', icon: Package },
  { label: 'Categories', href: '/dashboard/admin/categories', icon: Tags },
  { label: 'Suppliers', href: '/dashboard/admin/suppliers', icon: Handshake },
  { label: 'Purchase Orders', href: '/dashboard/admin/purchase-orders', icon: ClipboardList },
  { label: 'Returns', href: '/dashboard/admin/returns', icon: Undo2 },
  { label: 'Transactions', href: '/dashboard/admin/transactions', icon: ArrowLeftRight },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: BarChart3 },
  { label: 'Inventory', href: '/dashboard/admin/inventory', icon: Warehouse },
  { label: 'Employees', href: '/dashboard/admin/employees', icon: Users },
  { label: 'Activity Log', href: '/dashboard/admin/activity-log', icon: ScrollText },
  { label: 'AI Product Input', href: '/dashboard/admin/ai-product', icon: Bot },
];

const cashierNavItems: NavItem[] = [
  { label: 'POS', href: '/dashboard/cashier', icon: ShoppingCart },
  { label: 'Transaction History', href: '/dashboard/cashier/transactions', icon: History },
];

interface SidebarProps {
  role: UserRole;
  onClose?: () => void;
}

export function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === 'ADMIN' ? adminNavItems : cashierNavItems;
  const logout = useLogoutMutation();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200/60 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <span className="block text-base font-bold tracking-tight text-slate-900">
            CrackPOS
          </span>
          <span className="block text-[11px] font-medium leading-tight text-slate-400">
            {role === 'ADMIN' ? 'Admin Panel' : 'Cashier Terminal'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-500" />
                  )}
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200/60 p-3">
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {logout.isPending ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
