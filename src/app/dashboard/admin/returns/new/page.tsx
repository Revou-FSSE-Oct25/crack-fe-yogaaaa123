'use client';

import { CreateReturnForm } from '@/features/returns/components/CreateReturnForm';

export default function NewReturnPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Create Sales Return</h2>
      <CreateReturnForm />
    </div>
  );
}
