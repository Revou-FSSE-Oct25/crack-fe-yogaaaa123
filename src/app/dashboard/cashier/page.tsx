'use client';

import { Suspense } from 'react';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCartStore } from '@/features/sales/store/useCartStore';
import { useInventorySync } from '@/infrastructure/events/useInventorySync';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductSearchBar } from '@/features/products/components/ProductSearchBar';
import { CartSidebar } from '@/features/sales/components/CartSidebar';

// ---
// /dashboard/cashier — Point of Sale terminal
// Left: Product grid with search | Right: Cart sidebar with checkout
// ---

function CashierContent() {
  const { data, isLoading } = useProducts();
  const addItem = useCartStore((s) => s.addItem);

  // Enable real-time stock sync across terminals
  useInventorySync();

  const products = data?.data ?? [];

  return (
    <div className="flex h-full gap-0">
      {/* Product browsing area */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-4">
        <Suspense>
          <ProductSearchBar />
        </Suspense>

        {isLoading ? (
          <p className="py-12 text-center text-gray-400">Loading products…</p>
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

      {/* Cart sidebar */}
      <CartSidebar />
    </div>
  );
}

export default function CashierDashboardPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-gray-400">Loading POS…</p>}>
      <CashierContent />
    </Suspense>
  );
}
