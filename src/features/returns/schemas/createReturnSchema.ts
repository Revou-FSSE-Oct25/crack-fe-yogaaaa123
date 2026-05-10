import { z } from 'zod';

// ---
// Sales Return Schema — Zod validation
// Backend expects quantity as number string
// ---

const returnItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required'),
});

export const createReturnSchema = z.object({
  salesOrderId: z.string().uuid('Please select a sales order'),
  items: z
    .array(returnItemSchema)
    .min(1, 'Return must contain at least one item'),
  reason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)'),
});

export type CreateReturnFormInput = z.infer<typeof createReturnSchema>;

/** Transform return data to API format (convert numbers to strings) */
export function transformReturnToApi(data: CreateReturnFormInput) {
  return {
    ...data,
    items: data.items.map(item => ({
      ...item,
      quantity: item.quantity.toString(),
    })),
  };
}
