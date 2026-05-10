import { z } from 'zod';

// ---
// Login Schema — Aturan main/validasi buat form login pakai Zod.
// Ini dibikin mirip sama validasi DTO-nya NestJS di backend biar konsisten.
// NestJS equivalent (class-validator):
//   @IsString() @MinLength(3) username: string;
//   @IsString() @MinLength(6) password: string;
// ---

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
