'use client';

import { Suspense, useState } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { ProductSearchBar } from '@/features/products/components/ProductSearchBar';
import { ProductForm } from '@/features/products/components/ProductForm';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import type { Product } from '@/features/products/types';

// ---
// /dashboard/admin/products — Product management page (Admin only)
// ---

const columns: Column<Product>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Price', accessor: (row) => formatCurrency(row.price) },
  { header: 'Stock', accessor: (row) => (
    <span className={row.stock <= 5 ? 'font-semibold text-red-600' : ''}>
      {row.stock}
    </span>
  )},
  { header: 'Category', accessor: 'categoryName' },
];

function ProductsContent() {
  const { data, isLoading } = useProducts();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const products = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          + Add Product
        </Button>
      </div>

      <ProductSearchBar />

      {isLoading ? (
        <p className="py-8 text-center text-gray-400">Loading products…</p>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(row) => row.id}
          emptyMessage="No products found."
        />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Product"
      >
        <ProductForm onSuccess={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<p className="py-8 text-center text-gray-400">Loading…</p>}>
      <ProductsContent />
    </Suspense>
  );
}
