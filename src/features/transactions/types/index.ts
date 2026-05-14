// ---
// Transaction Domain Types — match BE DTOs
// ---

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface TransactionItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: TransactionStatus;
  user: {
    id: string;
    username: string;
  };
  items: TransactionItem[];
  createdAt: string;
}

export interface TransactionQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: TransactionStatus;
}
