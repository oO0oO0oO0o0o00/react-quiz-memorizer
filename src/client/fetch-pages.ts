import _ from "underscore";
import { FetchPagesOptions, FetchPagesResult } from "./fetch-pages-types";

export async function fetchPages(
  options: FetchPagesOptions
): Promise<PartialCollection> {
  const resp = await fetch(
    `api/${options.id}/pages?from=${options.from}&to=${options.to}`);
  const j = await resp.json();
  return FetchPagesResult.parse(j);
}

export type PartialCollection = FetchPagesResult

export type NullablePartialCollection = PartialCollection | null
