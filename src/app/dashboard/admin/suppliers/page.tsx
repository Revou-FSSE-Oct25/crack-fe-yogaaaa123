'use client';

import { Suspense, useState } from 'react';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { useCreateSupplier } from '@/features/suppliers/hooks/useCreateSupplier';
import { useUpdateSupplier } from '@/features/suppliers/hooks/useUpdateSupplier';
import { useDeleteSupplier } from '@/features/suppliers/hooks/useDeleteSupplier';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Supplier } from '@/features/suppliers/types';

function SupplierForm({ supplier, onSuccess }: { supplier?: Supplier; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: supplier?.name ?? '',
    contactName: supplier?.contactName ?? '',
    phone: supplier?.phone ?? '',
    email: supplier?.email ?? '',
    address: supplier?.address ?? '',
  });
  const create = useCreateSupplier();
  const update = useUpdateSupplier();
  const mutation = supplier ? update : create;

  const handleSubmit = () => {
    if (supplier) {
      update.mutate({ id: supplier.id, ...form }, { onSuccess });
    } else {
      create.mutate(form, { onSuccess });
    }
  };

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="flex flex-col gap-4">
      <Input id="sup-name" label="Name" value={form.name} onChange={updateField('name')} placeholder="Supplier name" />
      <Input id="sup-contact" label="Contact Name" value={form.contactName} onChange={updateField('contactName')} placeholder="Optional" />
      <Input id="sup-phone" label="Phone" value={form.phone} onChange={updateField('phone')} placeholder="Optional" />
      <Input id="sup-email" label="Email" value={form.email} onChange={updateField('email')} placeholder="Optional" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Address</label>
        <textarea value={form.address} onChange={updateField('address')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={2} />
      </div>
      <Button onClick={handleSubmit} isLoading={mutation.isPending}>
        {supplier ? 'Update' : 'Create'} Supplier
      </Button>
    </div>
  );
}

function SuppliersContent() {
  const { data, isLoading } = useSuppliers();
  const deleteSup = useDeleteSupplier();
  const [modal, setModal] = useState<{ open: boolean; supplier?: Supplier }>({ open: false });

  const suppliers = data?.data ?? [];
  const columns: Column<Supplier>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Contact', accessor: (r) => r.contactName ?? '-' },
    { header: 'Phone', accessor: (r) => r.phone ?? '-' },
    { header: 'Email', accessor: (r) => r.email ?? '-' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setModal({ open: true, supplier: row })} className="text-indigo-600 hover:text-indigo-900">Edit</button>
          <button onClick={() => { if (confirm('Delete ' + row.name + '?')) deleteSup.mutate(row.id); }} className="text-red-600 hover:text-red-900">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
        <Button onClick={() => setModal({ open: true })}>+ Add Supplier</Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-gray-400">Loading suppliers...</p>
      ) : (
        <DataTable columns={columns} data={suppliers} keyExtractor={(r) => r.id} emptyMessage="No suppliers found." />
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.supplier ? 'Edit Supplier' : 'Create Supplier'}>
        <SupplierForm supplier={modal.supplier} onSuccess={() => setModal({ open: false })} />
      </Modal>
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<p className="py-8 text-center text-gray-400">Loading...</p>}>
      <SuppliersContent />
    </Suspense>
  );
}
