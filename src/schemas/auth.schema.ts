import { z } from "zod";

export const registerSchema = z.object({
  userId: z.string(),
  password: z.string().min(4),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  userId: z.string(),
  password: z.string(),
});
