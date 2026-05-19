'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { DashboardHeader } from '@/components/layouts/DashboardHeader';
import { AiChatWidget } from '@/features/ai/components/AiChatWidget';
import type { UserRole } from '@/infrastructure/utils/constants';
import { jwtVerify } from 'jose';

interface Props {
  role?: UserRole;
  children: ReactNode;
}

function decodeRoleFromCookie(): UserRole | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split('; ').reduce((acc, c) => {
    const [k, v] = c.split('=');
    if (k) acc[k.trim()] = v;
    return acc;
  }, {} as Record<string, string>);
  const token = cookies['auth_token'] || cookies['at'];
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function DashboardShell({ role: serverRole, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(serverRole || null);

  useEffect(() => {
    if (!role) {
      const r = decodeRoleFromCookie();
      if (r) {
        setRole(r);
      } else {
        window.location.href = '/login';
      }
    }
  }, [role]);

  if (!role) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer di mobile, fixed di desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 -translate-x-full transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : ''
        }`}
      >
        <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          role={role}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <AiChatWidget />
    </div>
  );
}
