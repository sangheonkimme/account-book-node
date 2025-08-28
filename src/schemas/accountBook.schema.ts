import { z } from "zod";

export const accountBookSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.string(),
});

export const updateAccountBookSchema = z.object({
  description: z.string().optional(),
  type: z.string().optional(),
});

export const reorderAccountBookSchema = z.object({
  orderedIds: z.array(z.number()),
});
