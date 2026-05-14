'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPurchaseOrderSchema, type CreatePurchaseOrderFormInput } from '../schemas/createPurchaseOrderSchema';
import { useCreatePurchaseOrder } from '../hooks/useCreatePurchaseOrder';
import { useProducts } from '@/features/products/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ApiError } from '@/infrastructure/api/types';

interface CreatePurchaseOrderFormProps {
  suppliers: Array<{ id: string; name: string }>;
}

export function CreatePurchaseOrderForm({ suppliers }: CreatePurchaseOrderFormProps) {
  const { data: productsData } = useProducts();
  const products = productsData?.data ?? [];
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreatePurchaseOrderFormInput>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const createMutation = useCreatePurchaseOrder();
  const watchItems = watch('items');

  const totalAmount = watchItems.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitPrice || 0);
  }, 0);

  const onSubmit = (data: CreatePurchaseOrderFormInput) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Information</h3>
        
        <div className="mb-4">
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
            Supplier *
          </label>
          <select
            id="supplierId"
            autoFocus
            {...register('supplierId')}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          {errors.supplierId && (
            <p className="mt-1 text-xs text-red-600">{errors.supplierId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional notes..."
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Items</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ productId: '', quantity: 1, unitPrice: 0 })}
          >
            + Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 rounded-lg border border-gray-200 p-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Product *</label>
                <select
                  {...register(`items.${index}.productId`)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
                {errors.items?.[index]?.productId && (
                  <p className="mt-1 text-xs text-red-600">{errors.items[index]?.productId?.message}</p>
                )}
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
                {errors.items?.[index]?.quantity && (
                  <p className="mt-1 text-xs text-red-600">{errors.items[index]?.quantity?.message}</p>
                )}
              </div>

              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700">Unit Price *</label>
                <input
                  type="number"
                  {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.01"
                />
                {errors.items?.[index]?.unitPrice && (
                  <p className="mt-1 text-xs text-red-600">{errors.items[index]?.unitPrice?.message}</p>
                )}
              </div>

              {fields.length > 1 && (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {errors.items && typeof errors.items.message === 'string' && (
          <p className="mt-2 text-sm text-red-600">{errors.items.message}</p>
        )}

        <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              Rp {totalAmount.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {createMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {(createMutation.error as unknown as ApiError)?.message ?? 'Failed to create purchase order'}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={createMutation.isPending}>
          Create Purchase Order
        </Button>
      </div>
    </form>
  );
}
