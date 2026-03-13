import { z } from 'zod';

// ---
// /dashboard/admin/inventory — Data Contract for NestJS Backend
// ---

export const stockMovementType = z.enum(['IN', 'OUT', 'ADJUSTMENT']);

export const stockMovementSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  type: stockMovementType,
  quantityChange: z.number().int(), // Positive for IN, negative for OUT
  notes: z.string().optional(),
  adminId: z.string(),
  adminName: z.string(),
  // Standard ISO-8601 date string for clear day/month/year parsing
  createdAt: z.string().datetime(),
});

export const createStockMovementSchema = z.object({
  productId: z.string().uuid(),
  type: stockMovementType,
  quantityChange: z.number().int().refine(val => val !== 0, { message: "Quantity change cannot be zero" }),
  notes: z.string().max(255).optional(),
});

export type StockMovement = z.infer<typeof stockMovementSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
