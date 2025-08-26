import { z } from "zod";

export const accountBookSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.string(),
});

export const reorderAccountBookSchema = z.object({
  orderedIds: z.array(z.number()),
});
