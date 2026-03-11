'use client';

import { useCartStore } from '../store/useCartStore';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import { formatCurrency } from '@/infrastructure/utils/formatCurrency';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';

// ============================================================================
// CartSidebar — Displays cart contents and checkout action
// Lives in the cashier POS layout as a persistent right sidebar.
// ============================================================================

export function CartSidebar() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const checkout = useCreateTransaction();

  const totalPrice = getTotalPrice();
  const isEmpty = items.length === 0;

  return (
    <aside className="flex h-full w-80 flex-col border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
        <p className="text-xs text-gray-500">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {isEmpty ? (
          <p className="py-8 text-center text-sm text-gray-400">
            Cart is empty
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(item.price)} × {item.cartQuantity}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-sm hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{item.cartQuantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-sm hover:bg-gray-200"
                    disabled={item.cartQuantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label={`Remove ${item.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer — Total + Checkout */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        {checkout.isError && (
          <p className="mb-2 rounded-md bg-red-50 p-2 text-xs text-red-600">
            {(checkout.error as unknown as ApiError)?.message ?? 'Checkout failed.'}
          </p>
        )}

        {checkout.isSuccess && (
          <p className="mb-2 rounded-md bg-green-50 p-2 text-xs text-green-600">
            Transaction completed!
          </p>
        )}

        <Button
          onClick={() => checkout.mutate()}
          disabled={isEmpty}
          isLoading={checkout.isPending}
          className="w-full"
          size="lg"
        >
          Checkout
        </Button>
      </div>
    </aside>
  );
}
