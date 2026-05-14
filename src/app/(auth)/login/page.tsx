import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton';

export const metadata: Metadata = {
  title: 'Login — CrackPOS',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <span className="text-3xl">💎</span>
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            CrackPOS
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
          <LoginForm />
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
