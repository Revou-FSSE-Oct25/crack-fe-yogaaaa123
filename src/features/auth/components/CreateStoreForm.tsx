'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateStore } from '../hooks/useCreateStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';
import { useSearchParams } from 'next/navigation';

const createStoreSchema = z.object({
  storeName: z.string().min(3, 'Store name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  plan: z.string().optional(),
});

type CreateStoreInput = z.infer<typeof createStoreSchema>;

export function CreateStoreForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      plan,
    },
  });

  const createStore = useCreateStore();

  const onSubmit = (data: CreateStoreInput) => {
    createStore.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <input type="hidden" {...register('plan')} />
      <Input
        id="storeName"
        label="Store Name"
        placeholder="My Store"
        error={errors.storeName}
        {...register('storeName')}
      />

      <Input
        id="address"
        label="Address"
        placeholder="123 Main St, City"
        error={errors.address}
        {...register('address')}
      />

      <Input
        id="phone"
        label="Phone"
        placeholder="+62812345678"
        error={errors.phone}
        {...register('phone')}
      />

      {createStore.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(createStore.error as unknown as ApiError)?.message ?? 'Failed to create store'}
        </p>
      )}

      <Button type="submit" isLoading={createStore.isPending} size="lg">
        Create Store
      </Button>
    </form>
  );
}
