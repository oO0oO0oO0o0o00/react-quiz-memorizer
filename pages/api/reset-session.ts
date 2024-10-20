import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseClient } from "../../src/db/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { data, error } = await supabaseClient.directoriesTable
    .delete().is("parent_id", null).eq("name", "session");
  res.status(200).json({ data, error });
}