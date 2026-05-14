import { z } from 'zod';

// ---
// Purchase Order Schema — Zod validation for create/edit forms
// NestJS backend expects quantity/unitPrice as number strings
// Frontend form uses number inputs, so we transform before sending to API
// ---

const purchaseOrderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().uuid('Please select a supplier'),
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, 'Purchase order must contain at least one item'),
  notes: z.string().optional(),
});

export type CreatePurchaseOrderFormInput = z.infer<typeof createPurchaseOrderSchema>;

function generateOrderNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const seq = String(Date.now()).slice(-4);
  return `PO-${yy}${mm}${dd}-${seq}`;
}

/** Transform purchase order data to API format (convert numbers to strings) */
export function transformPurchaseOrderToApi(data: CreatePurchaseOrderFormInput) {
  return {
    ...data,
    orderNumber: generateOrderNumber(),
    items: data.items.map(item => ({
      ...item,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
    })),
  };
}
