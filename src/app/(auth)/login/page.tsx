import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login — CrackPOS',
};

// ---
// /login — Public login page
// ---

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        {/* Branding */}
        <div className="mb-8 text-center">
          <span className="text-4xl">💎</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">CrackPOS</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
