'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { UserRole } from '@/infrastructure/utils/constants';
import { ChangePasswordModal } from '@/features/change-password/components/ChangePasswordModal';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import {
  Bell, ChevronDown, KeyRound, Menu,
  AlertTriangle, ClipboardList, Package
} from 'lucide-react';

interface DashboardHeaderProps {
  role: UserRole;
  userName?: string;
  onMenuClick?: () => void;
}

const notifIconMap: Record<string, React.ReactNode> = {
  low_stock: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  pending_po: <ClipboardList className="h-4 w-4 text-blue-500" />,
  pending_return: <Package className="h-4 w-4 text-purple-500" />,
};

const notifBgMap: Record<string, string> = {
  low_stock: 'bg-amber-50',
  pending_po: 'bg-blue-50',
  pending_return: 'bg-purple-50',
};

export function DashboardHeader({ role, userName, onMenuClick }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { total, items, isLoading } = useNotifications();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    }
    if (showNotif) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotif]);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md md:h-16 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 md:text-lg">
              {role === 'ADMIN' ? 'Dashboard' : 'POS'}
            </h1>
            <p className="hidden text-xs text-slate-400 md:block">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:bg-slate-100 md:h-9 md:w-9 ${
                total > 0 ? 'text-rose-500' : 'text-slate-400'
              }`}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 md:h-4.5 md:w-4.5" />
              {total > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white md:h-4.5 md:min-w-[18px] md:text-[10px]">
                  {total > 9 ? '9+' : total}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 top-full z-50 mt-2 max-h-[70dvh] w-80 animate-scale-in overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl md:w-96">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <p className="text-xs text-slate-400">
                    {isLoading ? 'Loading...' : `${total} item${total !== 1 ? 's' : ''} need attention`}
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-2 p-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
                      ))}
                    </div>
                  ) : items.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                        <Package className="h-5 w-5 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">All good!</p>
                      <p className="text-xs text-slate-400">No items need attention</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setShowNotif(false)}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${notifBgMap[item.type] ?? ''}`}
                        >
                          <div className="mt-0.5 shrink-0">{notifIconMap[item.type]}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900">{item.label}</p>
                            <p className="truncate text-xs text-slate-500">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="hidden rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 md:inline-block md:px-2.5 md:py-1 md:text-[11px]">
            {role === 'ADMIN' ? 'Admin' : 'Staff'}
          </span>

          {userName && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm text-slate-600 transition-all hover:bg-slate-100 md:gap-2 md:px-3 md:py-1.5"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white md:h-7 md:w-7 md:text-[11px]">
                  {userName?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <span className="hidden text-sm font-medium sm:block">{userName}</span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 md:block" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 animate-scale-in overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-lg md:w-48">
                    <button
                      onClick={() => {
                        setShowChangePasswordModal(true);
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <KeyRound className="h-4 w-4 text-slate-400" />
                      Change Password
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}
