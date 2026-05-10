import { z } from 'zod';

const salesOrderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.string().min(1, 'Unit price is required'),
});

export const createSalesOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  customerId: z.string().optional(),
  items: z
    .array(salesOrderItemSchema)
    .min(1, 'Cart must contain at least one item'),
});

export type CreateSalesOrderInput = z.infer<typeof createSalesOrderSchema>;
