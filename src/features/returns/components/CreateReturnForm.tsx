'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createReturnSchema, type CreateReturnFormInput } from '../schemas/createReturnSchema';
import { useCreateReturn } from '../hooks/useCreateReturn';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/infrastructure/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { SalesOrder } from '@/features/sales/types';
import type { ApiError } from '@/infrastructure/api/types';

export function CreateReturnForm() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  
  const { data: ordersData } = useQuery({
    queryKey: ['sales-orders-for-return'],
    queryFn: () => apiClient<{ data: SalesOrder[] }>('/sales?status=COMPLETED'),
  });

  const { data: orderDetail } = useQuery({
    queryKey: ['sales-order', selectedOrderId],
    queryFn: () => apiClient<SalesOrder>(`/sales/${selectedOrderId}`),
    enabled: !!selectedOrderId,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateReturnFormInput>({
    resolver: zodResolver(createReturnSchema),
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const createMutation = useCreateReturn();

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const onSubmit = (data: CreateReturnFormInput) => {
    createMutation.mutate(data);
  };

  const orders = ordersData?.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Return Information</h3>
        
        <div className="mb-4">
          <label htmlFor="salesOrderId" className="block text-sm font-medium text-gray-700">
            Sales Order *
          </label>
          <select
            id="salesOrderId"
            {...register('salesOrderId')}
            onChange={(e) => handleOrderSelect(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a completed sales order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.orderNumber} - {new Date(order.createdAt).toLocaleDateString('id-ID')}
              </option>
            ))}
          </select>
          {errors.salesOrderId && (
            <p className="mt-1 text-xs text-red-600">{errors.salesOrderId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason for Return *
          </label>
          <textarea
            id="reason"
            {...register('reason')}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Explain why this order is being returned..."
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>
          )}
        </div>
      </div>

      {orderDetail && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Items to Return</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                if (orderDetail.items.length > 0) {
                  const firstItem = orderDetail.items[0];
                  append({
                    productId: firstItem.productId,
                    quantity: 1,
                    reason: '',
                  });
                }
              }}
            >
              + Add Item
            </Button>
          </div>

          <div className="mb-4 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-semibold text-gray-700">Order Items:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {orderDetail.items.map((item) => (
                <li key={item.productId}>
                  {item.product.name} - Qty: {item.quantity}
                </li>
              ))}
            </ul>
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
                    {orderDetail.items.map((item) => (
                      <option key={item.productId} value={item.productId}>
                        {item.product.name} (Max: {item.quantity})
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

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Item Reason *</label>
                  <input
                    type="text"
                    {...register(`items.${index}.reason`)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Damaged, Wrong item"
                  />
                  {errors.items?.[index]?.reason && (
                    <p className="mt-1 text-xs text-red-600">{errors.items[index]?.reason?.message}</p>
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
        </div>
      )}

      {createMutation.isError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {(createMutation.error as unknown as ApiError)?.message ?? 'Failed to create return'}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={createMutation.isPending} disabled={!selectedOrderId}>
          Submit Return
        </Button>
      </div>
    </form>
  );
}
