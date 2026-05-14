'use client';

import { Suspense } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCartStore } from '@/features/sales/store/useCartStore';
import { useInventorySync } from '@/infrastructure/events/useInventorySync';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductSearchBar } from '@/features/products/components/ProductSearchBar';
import { CartSidebar } from '@/features/sales/components/CartSidebar';

function CashierContent() {
  const { data, isLoading } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  useInventorySync();

  const products = data?.data ?? [];

  return (
    <div className="flex h-full gap-0">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-4">
        <Suspense>
          <ProductSearchBar />
        </Suspense>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-sm font-medium text-slate-500">No products available</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions
                onAddToCart={addItem}
              />
            ))}
          </div>
        )}
      </div>

      <CartSidebar />
    </div>
  );
}

export default function CashierDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading POS…</p>
          </div>
        </div>
      }
    >
      <CashierContent />
    </Suspense>
  );
}
