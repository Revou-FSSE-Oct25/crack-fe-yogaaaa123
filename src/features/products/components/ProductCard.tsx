'use client';

import type { Product } from '../types';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';

// ---
// ProductCard — Displays a single product tile
// Cashier variant includes "Add to Cart" action.
// ---

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

export function ProductCard({ product, onAddToCart, showActions = false }: ProductCardProps) {
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image placeholder */}
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <span className="text-3xl text-indigo-300">📦</span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-lg font-bold text-indigo-600">
          {formatCurrency(product.price)}
        </p>

        <p className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
          {isOutOfStock ? 'Out of stock' : `Stock: ${product.stockQuantity}`}
        </p>

        {showActions && onAddToCart && (
          <Button
            size="sm"
            variant={isOutOfStock ? 'ghost' : 'primary'}
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className="mt-auto w-full"
          >
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </div>
  );
}
