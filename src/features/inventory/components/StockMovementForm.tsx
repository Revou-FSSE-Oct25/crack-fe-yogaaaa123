'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStockMovementSchema, type CreateStockMovementInput } from '../schemas/inventorySchema';
import { useCreateStockMovement } from '../hooks/useCreateStockMovement';
import { useProducts } from '@/features/products/hooks/useProducts';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';

interface StockMovementFormProps {
  type: 'IN' | 'OUT';
  onSuccess: () => void;
}

export function StockMovementForm({ type, onSuccess }: StockMovementFormProps) {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const products = productsData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStockMovementInput>({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: {
      type,
    },
  });

  const mutation = useCreateStockMovement();

  const onSubmit = (data: CreateStockMovementInput) => {
    // If it's an OUT movement, ensure quantityChange is negative
    if (data.type === 'OUT' && data.quantityChange > 0) {
      data.quantityChange = -data.quantityChange;
    }
    
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Pilih Barang</label>
        <select
          {...register('productId')}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 ${
            errors.productId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
          }`}
          disabled={isLoadingProducts}
        >
          <option value="">-- Pilih Barang --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stok saat ini: {p.stock})
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-xs text-red-500">{errors.productId.message}</p>
        )}
      </div>

      <Input
        id="quantityChange"
        type="number"
        label={type === 'IN' ? 'Jumlah Barang Masuk' : 'Jumlah Barang Keluar'}
        placeholder="Contoh: 10"
        error={errors.quantityChange}
        {...register('quantityChange', { valueAsNumber: true })}
      />

      <Input
        id="notes"
        label="Keterangan (Opsional)"
        placeholder={type === 'IN' ? 'Dari Suplier A...' : 'Barang rusak / Terjual manual...'}
        error={errors.notes}
        {...register('notes')}
      />

      {mutation.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(mutation.error as unknown as ApiError)?.message ?? 'Gagal menyimpan data.'}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          isLoading={mutation.isPending}
        >
          {type === 'IN' ? 'Catat Barang Masuk' : 'Catat Barang Keluar'}
        </Button>
      </div>
    </form>
  );
}
