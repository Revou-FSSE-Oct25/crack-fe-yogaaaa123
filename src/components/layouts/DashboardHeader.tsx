'use client';

import { useState } from 'react';
import type { UserRole } from '@/infrastructure/utils/constants';
import { ChangePasswordModal } from '@/features/change-password/components/ChangePasswordModal';

// ---
// DashboardHeader — Nampilin judul halaman (tergantung role) dan info user yang lagi login
// ---

interface DashboardHeaderProps {
  role: UserRole;
  userName?: string;
}

export function DashboardHeader({ role, userName }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <h1 className="text-lg font-semibold text-gray-900">
          {role === 'ADMIN' ? 'Admin Dashboard' : 'Point of Sale'}
        </h1>

        <div className="relative flex items-center gap-3">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            {role}
          </span>
          {userName && (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <span>{userName}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={() => {
                    setShowChangePasswordModal(true);
                    setShowUserMenu(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  🔒 Change Password
                </button>
              </div>
            </>
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
