import type { Product } from '@/features/products/types';

export interface SalesOrderItem {
  productId: string;
  product: { name: string; sku: string };
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  user: { username: string };
  items: SalesOrderItem[];
  createdAt: string;
}

export interface CreateSalesOrderPayload {
  orderNumber: string;
  customerId?: string;
  items: { productId: string; quantity: number; unitPrice: string }[];
}

export interface CartItem extends Product {
  cartQuantity: number;
}
