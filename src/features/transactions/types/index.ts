import type { Product } from '@/features/products/types';

// ---
// Transaction Domain Types
// ---

/** A single item within a transaction */
export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** Full transaction record returned by the backend */
export interface Transaction {
  id: string;
  items: TransactionItem[];
  totalAmount: number;
  cashierId: string;
  cashierName?: string;
  createdAt: string;
}

/** Payload sent to POST /transactions */
export interface CreateTransactionPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
}

/** Cart item extends Product with a mutable quantity */
export interface CartItem extends Product {
  cartQuantity: number;
}
