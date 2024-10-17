import _ from "underscore";
import U from "../utils";
import example from './example-gen';
import { FetchPagesOptions, FetchPagesResult } from "../../pages/api/[id]/pages";

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
