import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string().optional(),
  price: z
    .number()
    .int('Price must be an integer')
    .positive('Price must be greater than 0'),
  stockQuantity: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock cannot be negative'),
  reorderLevel: z
    .number()
    .int('Reorder level must be an integer')
    .nonnegative('Reorder level cannot be negative'),
  categoryId: z
    .string()
    .uuid('Invalid category ID format'),
  supplierId: z
    .string()
    .uuid('Invalid supplier ID format')
    .optional(),
  imageUrl: z
    .string()
    .url('Invalid image URL format')
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export function transformProductToApi(data: CreateProductInput | UpdateProductInput) {
  return {
    ...data,
    price: data.price?.toString(),
    stockQuantity: data.stockQuantity?.toString(),
    reorderLevel: data.reorderLevel?.toString(),
  };
}

