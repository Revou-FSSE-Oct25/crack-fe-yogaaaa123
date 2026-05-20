'use client';

import { Suspense, useState } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useDeleteProduct } from '@/features/products/hooks/useDeleteProduct';
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

function ProductsContent() {
  const { data, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    product?: Product;
  }>({ isOpen: false });

  const products = data?.data ?? [];

  const columns: Column<Product>[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Price', accessor: (row) => formatCurrency(row.price) },
    { header: 'Stock', accessor: (row) => (
      <span className={row.stockQuantity <= 5 ? 'font-semibold text-red-600' : ''}>
        {row.stockQuantity}
      </span>
    )},
    { header: 'Category', accessor: (row) => row.category?.name },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setModalState({ isOpen: true, product: row })}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.name}?`)) {
                deleteProduct.mutate(row.id);
              }
            }}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Button onClick={() => setModalState({ isOpen: true })}>
          + Add Product
        </Button>
      </div>

      <Suspense fallback={<div className="text-center text-gray-400">Loading search...</div>}>
        <ProductSearchBar />
      </Suspense>

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
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        title={modalState.product ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm 
          product={modalState.product}
          onSuccess={() => setModalState({ isOpen: false })} 
        />
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
