'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '../schemas/registerSchema';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function RegisterForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'free';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      plan,
    },
  });

  const registration = useRegisterMutation();

  const onSubmit = (data: RegisterInput) => {
    registration.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register('plan')} />
      <Input
        id="storeName"
        label="Store Name"
        placeholder="Your store name"
        error={errors.storeName}
        {...register('storeName')}
      />

      <Input
        id="displayName"
        label="Display Name (optional)"
        placeholder="Your display name"
        error={errors.displayName}
        {...register('displayName')}
      />

      <Input
        id="username"
        label="Username"
        placeholder="Choose a username"
        error={errors.username}
        {...register('username')}
      />

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email}
        {...register('email')}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Create a password (min 8 chars)"
        error={errors.password}
        {...register('password')}
      />

      {registration.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(registration.error as unknown as ApiError)?.message ?? 'Registration failed.'}
        </p>
      )}

      <Button type="submit" isLoading={registration.isPending} size="lg" className="mt-2">
        Create Account
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign In
        </Link>
      </p>
    </form>
  );
}
