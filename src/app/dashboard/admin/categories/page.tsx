'use client';

import { Suspense, useState } from 'react';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useCreateCategory } from '@/features/categories/hooks/useCreateCategory';
import { useUpdateCategory } from '@/features/categories/hooks/useUpdateCategory';
import { useDeleteCategory } from '@/features/categories/hooks/useDeleteCategory';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Category } from '@/features/categories/types';
import type { ApiError } from '@/infrastructure/api/types';

function CategoryForm({ category, onSuccess }: { category?: Category; onSuccess: () => void }) {
  const [name, setName] = useState(category?.name ?? '');
  const [desc, setDesc] = useState(category?.description ?? '');
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const mutation = category ? update : create;
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (category) {
      update.mutate({ id: category.id, name, description: desc || undefined }, {
        onSuccess,
        onError: (e: Error) => setError(e.message),
      });
    } else {
      create.mutate({ name, description: desc || undefined }, {
        onSuccess,
        onError: (e: Error) => setError(e.message),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input id="cat-name" label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="Category name" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea value={desc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDesc(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={2} />
      </div>
      {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      <Button onClick={handleSubmit} isLoading={mutation.isPending}>
        {category ? 'Update' : 'Create'} Category
      </Button>
    </div>
  );
}

function CategoriesContent() {
  const { data, isLoading } = useCategories();
  const deleteCat = useDeleteCategory();
  const [modal, setModal] = useState<{ open: boolean; category?: Category }>({ open: false });

  const cats = data?.data ?? [];
  const columns: Column<Category>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: (row) => row.description ?? '-' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true, category: row })} className="text-indigo-600 hover:text-indigo-900">Edit</button>
          <button onClick={() => { if (confirm('Delete ' + row.name + '?')) deleteCat.mutate(row.id); }} className="text-red-600 hover:text-red-900">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <Button onClick={() => setModal({ open: true })}>+ Add Category</Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-gray-400">Loading categories...</p>
      ) : (
        <DataTable columns={columns} data={cats} keyExtractor={(r) => r.id} emptyMessage="No categories found." />
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.category ? 'Edit Category' : 'Create Category'}>
        <CategoryForm category={modal.category} onSuccess={() => setModal({ open: false })} />
      </Modal>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<p className="py-8 text-center text-gray-400">Loading...</p>}>
      <CategoriesContent />
    </Suspense>
  );
}
