import { z } from 'zod';

// ---
// Transaction Schema — Symmetrical blueprint for NestJS backend validation
// NestJS equivalent (class-validator):
//   @IsArray() @ValidateNested({ each: true }) items: TransactionItemDto[];
//   @IsUUID()                                  productId: string;
//   @IsInt() @Min(1)                           quantity: number;
// ---

const transactionItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createTransactionSchema = z.object({
  items: z
    .array(transactionItemSchema)
    .min(1, 'Cart must contain at least one item'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
