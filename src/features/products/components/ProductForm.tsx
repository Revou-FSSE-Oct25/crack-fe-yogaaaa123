'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, type CreateProductInput } from '../schemas/productSchema';
import { useCreateProduct } from '../hooks/useCreateProduct';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import { useCategories } from '@/features/categories/hooks/useCategories';
import type { Category } from '@/features/categories/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from './ImageUpload';
import type { ApiError } from '@/infrastructure/api/types';
import type { Product } from '../types';

// ---
// ProductForm — Admin-only form for creating or editing products
// ---

interface ProductFormProps {
  product?: Product; // If provided, we are in Edit mode
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const isEdit = !!product;
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: product ? {
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      reorderLevel: product.reorderLevel,
      categoryId: product.categoryId,
    } : undefined,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(product?.id ?? '');

  const mutation = isEdit ? updateProduct : createProduct;

  const onSubmit = (data: CreateProductInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  const handleImageUpload = (url: string) => {
    // In a real implementation, the ImageUpload component will upload the file
    // and return the URL, which we can then set in the form
    console.log('Image uploaded with URL:', url);
    // setValue('imageUrl', url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] p-1">
      <Input
        id="sku"
        label="SKU"
        placeholder="e.g. SKU-1001"
        error={errors.sku}
        {...register('sku')}
      />

      <Input
        id="name"
        label="Product Name"
        placeholder="e.g. Arabica Coffee Beans"
        error={errors.name}
        {...register('name')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Product Image</label>
        <ImageUpload onChange={handleImageUpload} />
      </div>

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
          id="stockQuantity"
          label="Stock"
          type="number"
          placeholder="0"
          error={errors.stockQuantity}
          {...register('stockQuantity', { valueAsNumber: true })}
        />
      </div>

      <Input
        id="reorderLevel"
        label="Reorder Level"
        type="number"
        placeholder="10"
        error={errors.reorderLevel}
        {...register('reorderLevel', { valueAsNumber: true })}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          {...register('categoryId')}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
          disabled={isLoadingCategories}
        >
          <option value="">Select a category</option>
          {categories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-xs text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(mutation.error as unknown as ApiError)?.message ?? `Failed to ${isEdit ? 'update' : 'create'} product.`}
        </p>
      )}

      <Button type="submit" isLoading={mutation.isPending}>
        {isEdit ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  );
}
