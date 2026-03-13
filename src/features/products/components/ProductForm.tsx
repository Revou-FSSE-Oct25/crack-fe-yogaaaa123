'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, type CreateProductInput } from '../schemas/productSchema';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';

// ---
// ProductForm — Admin-only form for creating new products
// ---

interface ProductFormProps {
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  });

  const createProduct = useCreateProduct();

  const onSubmit = (data: CreateProductInput) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="name"
        label="Product Name"
        placeholder="e.g. Arabica Coffee Beans"
        error={errors.name}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          label="Price"
          type="number"
          placeholder="0"
          error={errors.price}
          {...register('price', { valueAsNumber: true })}
        />

        <Input
          id="stock"
          label="Stock"
          type="number"
          placeholder="0"
          error={errors.stock}
          {...register('stock', { valueAsNumber: true })}
        />
      </div>

      <Input
        id="categoryId"
        label="Category ID"
        placeholder="UUID of the category"
        error={errors.categoryId}
        {...register('categoryId')}
      />

      {createProduct.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(createProduct.error as unknown as ApiError)?.message ?? 'Failed to create product.'}
        </p>
      )}

      <Button type="submit" isLoading={createProduct.isPending}>
        Create Product
      </Button>
    </form>
  );
}
