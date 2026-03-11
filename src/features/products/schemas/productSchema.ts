import { z } from 'zod';

// ============================================================================
// Product Schemas — Symmetrical blueprint for NestJS backend validation
// NestJS equivalent (class-validator):
//   @IsString() @MinLength(3) @MaxLength(100) name: string;
//   @IsInt() @Min(1)                          price: number;
//   @IsInt() @Min(0)                          stock: number;
//   @IsUUID()                                 categoryId: string;
// ============================================================================

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  price: z
    .number()
    .int('Price must be an integer')
    .positive('Price must be greater than 0'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative'),
  categoryId: z
    .string()
    .uuid('Invalid category ID format'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

/** Update schema — all fields optional (PATCH semantics) */
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
