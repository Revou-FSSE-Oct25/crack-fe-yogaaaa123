import { z } from 'zod';

export const registerSchema = z.object({
  storeName: z.string().min(3, 'Store name must be at least 3 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().optional(),
  plan: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
