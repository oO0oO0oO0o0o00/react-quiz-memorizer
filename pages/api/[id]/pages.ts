import type { NextApiRequest, NextApiResponse } from 'next'
import example from "../../../src/data/example-gen";
import { z } from 'zod';
import U from '../../../src/utils';
import _ from 'underscore';

const FetchPagesOptions = z.object({
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

export function queryPages(options: FetchPagesOptions): FetchPagesResult {
  console.log(`simulated fetchPages ${options.id}/${options.from}-${options.to}`);
  if (options.to >= example.length) {
    options.to = example.length - 1;
  }
  if (options.to < options.from) {
    throw Error("`to` cannot be less than `from`.");
  }
  const pages = _.range(options.from, options.to + 1);
  return {
    pages: pages,
    totalPage: example.length,
    data: pages.map((p) => example[p]),
  };
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FetchPagesResult>
) {
  const query = FetchPagesOptions.parse(req.query);
  await U.timeout(200);
  res.status(200).json(queryPages(query));
}
