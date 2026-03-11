import { z } from 'zod';

// ============================================================================
// /dashboard/admin/history — Data Contract for NestJS Backend
// ============================================================================

export const transactionItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  priceAtTransaction: z.number().min(0),
});

export const transactionHistorySchema = z.object({
  id: z.string(),
  cashierId: z.string(),
  cashierName: z.string(),
  totalAmount: z.number().min(0),
  paymentMethod: z.enum(['CASH', 'QRIS', 'CARD']),
  items: z.array(transactionItemSchema),
  // NestJS should return this as a standard ISO-8601 string (e.g., '2026-03-12T10:30:00Z')
  // The frontend will be responsible for formatting this into detailed DD/MM/YYYY HH:mm formats.
  createdAt: z.string().datetime(),
});

export type TransactionItem = z.infer<typeof transactionItemSchema>;
export type TransactionHistory = z.infer<typeof transactionHistorySchema>;
