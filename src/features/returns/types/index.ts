// ---
// Sales Return Domain Types — match BE DTOs
// ---

export interface ReturnItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  unitPrice: number;
  reason: string;
}

export interface SalesReturn {
  id: string;
  salesOrderId: string;
  salesOrder: {
    id: string;
    orderNumber: string;
  };
  totalRefund: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  items: ReturnItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReturnInput {
  salesOrderId: string;
  items: {
    productId: string;
    quantity: number;
    reason: string;
  }[];
  reason: string;
}
