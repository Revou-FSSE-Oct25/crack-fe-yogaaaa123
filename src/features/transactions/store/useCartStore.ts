import { create } from 'zustand';
import type { Product } from '@/features/products/types';
import type { CartItem } from '../types';

// ---
// Cart Store (Zustand)
// Manages ephemeral cart state on the client. This store is NEVER persisted
// to the server — it only lives until the cashier completes checkout.
// ---

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        // Increment quantity, capped at available stock
        return {
          items: state.items.map((i) =>
            i.id === product.id
              ? { ...i, cartQuantity: Math.min(i.cartQuantity + 1, product.stock) }
              : i,
          ),
        };
      }

      return {
        items: [...state.items, { ...product, cartQuantity: 1 }],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.id !== productId)
          : state.items.map((i) =>
              i.id === productId
                ? { ...i, cartQuantity: Math.min(quantity, i.stock) }
                : i,
            ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () =>
    get().items.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0,
    ),

  getItemCount: () =>
    get().items.reduce((count, item) => count + item.cartQuantity, 0),
}));
