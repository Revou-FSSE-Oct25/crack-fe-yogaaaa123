import { z } from 'zod';

// ============================================================================
// Login Schema — Symmetrical validation blueprint for NestJS backend
// NestJS equivalent (class-validator):
//   @IsString() @MinLength(3) username: string;
//   @IsString() @MinLength(6) password: string;
// ============================================================================

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
