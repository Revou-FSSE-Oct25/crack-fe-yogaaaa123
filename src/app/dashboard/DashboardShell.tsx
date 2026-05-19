'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { DashboardHeader } from '@/components/layouts/DashboardHeader';
import { AiChatWidget } from '@/features/ai/components/AiChatWidget';
import type { UserRole } from '@/infrastructure/utils/constants';

interface Props {
  role: UserRole | null;
  children: ReactNode;
}

export function DashboardShell({ role, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if no role (not logged in) is passed from server
  if (!role && typeof window !== 'undefined') {
    window.location.href = '/login';
    return null; // Don't render anything while redirecting
  }

  // If role is still null (e.g. during SSR when role is not yet determined),
  // we can render a loading state or return null temporarily
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
