import { createClient } from '@supabase/supabase-js';
import humps from "humps";
import { z } from 'zod';

const rawClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Do you think IDL / ORM can help?
// Look at the `rpc`s.
const InsertFilesResultItem = z.object({
  name: z.string(),
  id: z.number(),
});

const InsertFilesResult = z.array(InsertFilesResultItem);

const FetchDocumentsResultItem = z.object({
  id: z.number(),
  created_at: z.string(),
  parent_id: z.number(),
  name: z.string(),
  content: z.string(),
});

const FetchDocumentsResult = z.array(FetchDocumentsResultItem);

type InsertFilesResultItem = z.infer<typeof InsertFilesResultItem>;

type InsertFilesResult = z.infer<typeof InsertFilesResult>;

export interface InsertDocumentsItem {
  name: string,
  content: string,
};

type FetchDocumentsResultItem = z.infer<typeof FetchDocumentsResultItem>;

type FetchDocumentsResult = z.infer<typeof FetchDocumentsResult>;

class MySupabaseClient {
  rawClient = rawClient;

  get directoriesTable() { 
    return rawClient.from('directories');
  };

  async insertFolder(path: string) {
    const { data } = await rawClient
      .rpc('insert_folder', { path: path.split('/') })
      .throwOnError();
    return data;
  }

  async insertFolderQuick(
    name: string, parentId: number | null
  ): Promise<InsertFilesResultItem> {
    const data = await this.insertFoldersQuick([name], parentId);
    return data[0];
  }

  async insertFoldersQuick(
    names: string[], parentId: number | null, existsOk: boolean = true
  ): Promise<InsertFilesResult> {
    const fn = existsOk ? 'insert_or_get_folders_quick' : 'insert_folders_quick';
    const { data } = await rawClient
      .rpc(fn, humps.decamelizeKeys({ names, parentId }))
      .throwOnError();
    return InsertFilesResult.parse(data);
  }

  async insertDocumentsQuick(
    documents: InsertDocumentsItem[], parentId: number | null
  ): Promise<InsertFilesResult> {
    const { data } = await rawClient
      .rpc('insert_documents_quick', humps.decamelizeKeys({ documents, parentId }))
      .throwOnError();
    return InsertFilesResult.parse(data);
  }

  async fetchDocumentsQuick(
    names: string[], parentId: number | null
  ): Promise<FetchDocumentsResult> {
    const { data } = await rawClient
      .rpc('fetch_documents_quick', humps.decamelizeKeys({ names, parentId }))
      .throwOnError();
    return FetchDocumentsResult.parse(data);
  }
}

export const supabaseClient = new MySupabaseClient();
