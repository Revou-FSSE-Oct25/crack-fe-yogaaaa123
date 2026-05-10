import type { Metadata } from 'next';
import { SuperAdminLoginForm } from '@/features/auth/components/SuperAdminLoginForm';

export const metadata: Metadata = {
  title: 'Super Admin Login — CrackPOS',
};

export default function SuperAdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <span className="text-4xl">🔐</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Super Admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            Platform administration access
          </p>
        </div>

        <SuperAdminLoginForm />
      </div>
    </div>
  );
}
