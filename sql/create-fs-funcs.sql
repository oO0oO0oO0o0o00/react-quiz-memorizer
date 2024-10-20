-- So basically Postgres is the "real" backend of the project,
-- aside from the full-stacked Vercel.
-- Partly to play around Postgres functions
-- (and pgSQL or plPython in the future)
-- partly do not like multi-statement transactions
-- across the Internet involving multiple vendors & DCs.

-- DROP FUNCTION if exists insert_folder(text[]);

create or replace function insert_folder(path text[])
returns setof bigint
language sql volatile
as $$
  with parent as (
    select id from resolve_path($1[:array_length(path, 1) - 1])
    where file_type = 'folder' limit 1
  ) insert into directories (name, file_type, parent_id)
      select $1[array_length(path, 1)], 'folder', id from parent
      returning id
$$;

-- test
-- select * from insert_folder(array['A', 'asshole']);
-- select * from insert_folder(array['K', 'asshole']);

-- DROP FUNCTION if exists insert_document(text[], text);

create or replace function insert_document(path text[], content text)
returns setof bigint
language sql volatile
as $$
  with parent as (
    select id from resolve_path($1[:array_length(path, 1) - 1])
    where file_type = 'folder' limit 1
  ), insert_directories as (
    insert into directories (name, file_type, parent_id)
      select $1[array_length(path, 1)], 'document', id from parent
      returning id
  ) insert into documents(id, content)
    select id, $2 from insert_directories
    returning id
$$;

--test
-- select * from insert_document(array['A', 'B', 'B', 'X'], 'meow~');

-- drop function if exists insert_folders_quick;

create or replace function insert_folders_quick(
  names text[], parent_id bigint
) returns table(name text, id bigint)
language sql volatile
as $$
  insert into directories (name, file_type, parent_id)
      select name, 'folder', $2 from unnest($1) as name
      returning name, id
$$;

-- test
-- select * from insert_folders_quick(array['session'], null);

create or replace function insert_or_get_folders_quick(
  names text[], parent_id bigint
) returns table(name text, id bigint)
language sql volatile
as $$
  with insertion as (
    insert into directories (name, file_type, parent_id)
      select name, 'folder', $2 from unnest($1) as name
      on conflict do nothing
      returning name, id
  ) select * from insertion union (
    select name, id from directories
      where name = any($1) and file_type = 'folder'
        and parent_id is not distinct from $2
  )
$$;
select * from insert_or_get_folders_quick(array['t1'], null);

-- test
-- select * from insert_or_get_folders_quick(array['session'], null);

drop type if exists insert_documents_quick_inputs cascade;

create type insert_documents_quick_inputs as (name text, content text);

create or replace function insert_documents_quick(
  documents insert_documents_quick_inputs[], parent_id bigint
) returns table(name text, id bigint)
language sql volatile
as $$
  with insert_directories as (
    insert into directories (name, file_type, parent_id)
      select inputs.name, 'document', $2 from unnest($1) as inputs
      returning name, id
  ), insert_documents as (
    insert into documents(id, content)
      select id, content from insert_directories join unnest($1) as inputs using (name)
  ) select name, id from insert_directories
$$;

select * from insert_documents_quick(array[
    row ('f1', 'nya')::insert_documents_quick_inputs,
    row ('f2', 'nyamo')::insert_documents_quick_inputs
  ], 1);

drop type if exists fetch_folder_result cascade;

create type fetch_folder_result as (
  id bigint,
  created_at timestamp,
  parent_id bigint,
  name text,
  children_count bigint
);
-- drop function if exists fetch_folder;

create or replace function fetch_folder(path text[])
returns setof fetch_folder_result language sql stable
as $$
  with resolve_query as (
    select * from resolve_path(path) where file_type = 'folder'
  ), count_query as (
    select count(*) as children_count from directories
      join resolve_query on directories.parent_id = resolve_query.id
  ) select
    resolve_query.id,
    resolve_query.created_at,
    resolve_query.parent_id,
    resolve_query.name,
    children_count
    from resolve_query join count_query on true
$$;

-- test
-- select * from fetch_folder(array['A', 'B', 'B']);

drop type if exists fetch_document_result cascade;

create type fetch_document_result as (
  id bigint,
  created_at timestamp,
  parent_id bigint,
  name text,
  content text
);
-- drop function if exists fetch_document;

create or replace function fetch_document(path text[])
returns setof fetch_document_result language sql stable
as $$
  select r.id, r.created_at, r.parent_id, r.name, content
  from resolve_path(path) as r join documents
   using (id) where file_type = 'document'
$$;

-- test
-- select * from fetch_document(array['A', 'B', 'B', 'A']);

-- delete from directories where id = 3;

-- drop function if exists fetch_folders_quick;

create or replace function fetch_folders_quick(
  names text[], parent_id bigint
) returns setof fetch_folder_result
language sql stable as $$
  with find_query as (
    select * from directories inner join unnest($1) as name using (name)
      where file_type = 'folder' and (
        parent_id = $2 or parent_id is null and $2 is null
  )), count_query as (
    select find_query.id as id, count(*) as children_count
      from directories
        join find_query on directories.parent_id = find_query.id
      group by find_query.id
  ) select
    find_query.id,
    find_query.created_at,
    find_query.parent_id,
    find_query.name,
    children_count
    from find_query join count_query using (id)
$$;

-- test
-- select * from fetch_folders_quick(array['A', 'B', 'X'], 3);
-- select * from fetch_folders_quick(array['A'], null);

create or replace function fetch_documents_quick(
  names text[], parent_id bigint
) returns setof fetch_document_result
language sql stable as $$
  select
    r.id, r.created_at, r.parent_id, r.name, content
  from directories r
    inner join unnest($1) as name using (name)
    join documents using (id)
      where file_type = 'document' and (
      parent_id = $2 or parent_id is null and $2 is null)
$$;

-- test
-- select * from fetch_documents_quick(array['A', 'B', 'X', 'p'], 6);
