import type { NextApiRequest, NextApiResponse } from 'next'
import _ from 'underscore';
import example from "../../../src/db/example-gen";
import { supabaseClient, InsertDocumentsItem } from "../../../src/db/supabase";
import { FetchPagesOptions, FetchPagesResult } from '../../../src/client/fetch-pages-types';
import { z } from 'zod';

const MetaFile = z.object({
  pages: z.number(),
});

export async function queryPages(
  options: FetchPagesOptions
): Promise<FetchPagesResult> {
  console.log(`fetchPages ${options.id}/${options.from}-${options.to}`);
  const sessionFolder = await supabaseClient.insertFolderQuick("session", null);
  if (sessionFolder == null) {
    throw Error("Cannot create or get session.");
  }
  const metaFile = await supabaseClient.fetchDocumentQuick(
    "meta", sessionFolder.id);
  let pagesCount: number;
  if (metaFile == null) {
    pagesCount = example.length;
    await supabaseClient.insertDocumentQuick(
      "meta", JSON.stringify({ pages: pagesCount }), sessionFolder.id);
  } else {
    const meta = MetaFile.parse(JSON.parse(metaFile.content));
    pagesCount = meta.pages;
  }
  if (options.to >= pagesCount) {
    options.to = pagesCount - 1;
  }
  if (options.to < options.from) {
    throw Error("`to` cannot be less than `from`.");
  }
  const pageIds = _.range(options.from, options.to + 1);
  const pages = new Map<number, any>();
  const existingPages = await supabaseClient.fetchDocumentsQuick(
    pageIds.map((p) => String(p)), sessionFolder.id);
  for (const page of existingPages) {
    pages.set(parseInt(page.name), JSON.parse(page.content));
  }
  const generatedPages: InsertDocumentsItem[] = [];
  for (const page of pageIds) {
    if (!pages.has(page)) {
      const pageData = example[page]; // simulate generation
      pages.set(page, pageData);
      generatedPages.push({ 
        name: String(page),
        content: JSON.stringify(pageData),
      });
    }
  }
  try {
    await supabaseClient.insertDocumentsQuick(
      generatedPages, sessionFolder.id);
  } catch {
    // TODO: Locking by setting file status to `loading`
    // (with timestamp to enable a timeout, say, 5 secs).
    // Ignoring for now as every generation is identical and fast.
    // They said that if someone leaves a comment like this
    // it means one is good enough being aware of the issue
    // and won't be thinked to be an a**hole,
    // even if people either know that the duplicated 
    // generation is not a thing or believe that
    // this bug must be addressed at least for dignity or for
    // their deity's (or deities') sack.
    // If someone has intentionally or tactically put the issue
    // aside, people (generally) understand and sometimes
    // appreciate / praise such decision because this would also
    // make them appear to be considerable and reasonable.
    // Why is this being written here in the code? Who knows.
    // If this comment make you uncomfortable, you deserve it.
  }
  return {
    pages: pageIds,
    totalPage: pagesCount,
    data: pageIds.map((p) => pages.get(p)),
  };
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FetchPagesResult>
) {
  const query = FetchPagesOptions.parse(req.query);
  const result = await queryPages(query);
  res.status(200).json(result);
}
