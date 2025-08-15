import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  phone: z.string().optional(),
  role: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
