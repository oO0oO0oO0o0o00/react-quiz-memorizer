
import { z } from 'zod';

export const FetchPagesOptions = z.object({
  id: z.string(),
  from: z.coerce.number().nonnegative(),
  to: z.coerce.number().nonnegative(),
});

export type FetchPagesOptions = z.infer<typeof FetchPagesOptions>;

export const FetchPagesResult = z.object({
  pages: z.array(z.number()),
  totalPage: z.number(),
  data: z.array(z.any()),
});

export type FetchPagesResult = z.infer<typeof FetchPagesResult>;
