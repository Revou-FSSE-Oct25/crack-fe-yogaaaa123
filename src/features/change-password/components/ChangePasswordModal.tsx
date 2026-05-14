'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordFormInput } from '../schemas/changePasswordSchema';
import { useChangePassword } from '../hooks/useChangePassword';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { ApiError } from '@/infrastructure/api/types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changeMutation = useChangePassword();

  const onSubmit = (data: ChangePasswordFormInput) => {
    changeMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          alert('Password updated successfully!');
          reset();
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    changeMutation.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="currentPassword"
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          error={errors.currentPassword}
          {...register('currentPassword')}
        />

        <Input
          id="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password (min 8 characters)"
          error={errors.newPassword}
          {...register('newPassword')}
        />

        <Input
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Confirm your new password"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        {changeMutation.isError && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">
              {(changeMutation.error as unknown as ApiError)?.message ?? 'Failed to change password'}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={changeMutation.isPending}>
            Change Password
          </Button>
        </div>
      </form>
    </Modal>
  );
}
