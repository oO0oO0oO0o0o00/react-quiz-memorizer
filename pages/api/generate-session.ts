import type { NextApiRequest, NextApiResponse } from 'next';
import example from "../../src/data/example-gen";
import database from "../../src/data/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  for (const page of example) {
    // database.from
  }
}