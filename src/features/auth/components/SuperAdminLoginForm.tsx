'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '../schemas/loginSchema';
import { useSuperAdminLogin } from '../hooks/useSuperAdminLogin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';

export function SuperAdminLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const login = useSuperAdminLogin();

  const onSubmit = (data: LoginInput) => {
    login.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        id="username"
        label="Username"
        placeholder="Enter super admin username"
        error={errors.username}
        {...register('username')}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter super admin password"
        error={errors.password}
        {...register('password')}
      />

      {login.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(login.error as unknown as ApiError)?.message ?? 'Login failed. Please try again.'}
        </p>
      )}

      <Button type="submit" isLoading={login.isPending} size="lg">
        Sign In as Super Admin
      </Button>
    </form>
  );
}
