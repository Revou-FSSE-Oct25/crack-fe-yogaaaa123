import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CreateStoreForm } from '@/features/auth/components/CreateStoreForm';

export const metadata: Metadata = {
  title: 'Create Store — CrackPOS',
};

export default function CreateStorePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <span className="text-4xl">🏪</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Create Your Store</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up your store to start managing inventory
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <CreateStoreForm />
        </Suspense>
      </div>
    </div>
  );
}
