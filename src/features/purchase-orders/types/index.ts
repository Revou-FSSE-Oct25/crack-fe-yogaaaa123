// ---
// Purchase Order Domain Types — match BE DTOs
// ---

export type PurchaseOrderStatus = 'PENDING' | 'RECEIVED' | 'PARTIAL' | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  unitPrice: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier: {
    id: string;
    name: string;
    contactName?: string;
  };
  status: PurchaseOrderStatus;
  totalPrice: string;
  items: PurchaseOrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderInput {
  supplierId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
}

export interface PurchaseOrderQueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: PurchaseOrderStatus;
}
