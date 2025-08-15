import { z } from "zod";

export const accountBookSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  description: z.string(),
  amount: z.number(),
  type: z.string(),
});
