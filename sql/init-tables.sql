drop TYPE IF EXISTS file_type cascade;

CREATE TYPE file_type AS ENUM ('folder', 'document');

DROP TABLE IF EXISTS documents;

DROP TABLE IF EXISTS directories CASCADE;

CREATE TABLE
  directories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    parent_id BIGINT NULL,
    file_type file_type NULL,
    NAME TEXT NULL,
    CONSTRAINT directories_parent_id_fkey FOREIGN KEY (parent_id)
      REFERENCES directories (id)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT unique_name_parent_id UNIQUE NULLS NOT DISTINCT (NAME, parent_id));

CREATE TABLE
  documents (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    content text null,
    CONSTRAINT documents_id_fkey FOREIGN KEY (id)
      REFERENCES directories (id)
      ON UPDATE CASCADE ON DELETE CASCADE);

CREATE INDEX directories_id_hash_idx 
  ON directories 
  USING HASH (id);

CREATE INDEX directories_parent_id_hash_idx 
  ON directories 
  USING HASH (parent_id);

CREATE INDEX directories_name_hash_idx 
  ON directories
  USING HASH (name);

REVOKE ALL ON TABLE directories from anon;

REVOKE ALL ON TABLE documents from anon;

-- DROP FUNCTION if exists resolve_path(text[]);

create or replace function resolve_path(path text[])
returns setof directories
language sql stable
as $$
  WITH RECURSIVE path_cte AS (
    SELECT
      *,
      ARRAY[name] AS PATH
    FROM directories
    WHERE name = $1[1] and parent_id is null -- root
    UNION ALL
    SELECT
      d.*,
      p.path || d.name
    FROM public.directories d
      INNER JOIN path_cte p ON d.parent_id = p.id
  ) SELECT id, created_at, parent_id, file_type, name FROM path_cte
  WHERE PATH = $1 LIMIT 1
$$;
