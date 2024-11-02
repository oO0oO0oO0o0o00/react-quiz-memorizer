-- DROP FUNCTION if exists insert_folder_sample(text[]);

create or replace function insert_folder_sample(path text[])
returns setof bigint
language sql volatile
as $$
  with parent as (
    select id from resolve_path_sample($1[:array_length(path, 1) - 1])
    where file_type = 'folder' limit 1
  ) insert into directories_sample (name, file_type, parent_id)
      select $1[array_length(path, 1)], 'folder', id from parent
      returning id
$$;

-- test
-- select * from insert_folder_sample(array['A', 'asshole']);
-- select * from insert_folder_sample(array['K', 'asshole']);

-- DROP FUNCTION if exists insert_document_sample(text[], text);

create or replace function insert_document_sample(path text[], content text)
returns setof bigint
language sql volatile
as $$
  with parent as (
    select id from resolve_path_sample($1[:array_length(path, 1) - 1])
    where file_type = 'folder' limit 1
  ), insert_directories as (
    insert into directories_sample (name, file_type, parent_id)
      select $1[array_length(path, 1)], 'document', id from parent
      returning id
  ) insert into documents_sample(id, content)
    select id, $2 from insert_directories
    returning id
$$;

--test
-- select * from insert_document_sample(array['A', 'B', 'B', 'X'], 'meow~');

-- drop function if exists insert_folders_quick_sample;

create or replace function insert_folders_quick_sample(
  names text[], parent_id bigint
) returns table(name text, id bigint)
language sql volatile
as $$
  insert into directories_sample (name, file_type, parent_id)
      select name, 'folder', $2 from unnest($1) as name
      returning name, id
$$;

-- test
-- select * from insert_folders_quick_sample(array['session'], null);

drop type if exists insert_documents_quick_sample_inputs cascade;

create type insert_documents_quick_sample_inputs as (name text, content text);

create or replace function insert_documents_quick_sample(
  documents insert_documents_quick_sample_inputs[], parent_id bigint
) returns table(name text, id bigint)
language sql volatile
as $$
  with insert_directories as (
    insert into directories_sample (name, file_type, parent_id)
      select inputs.name, 'document', $2 from unnest($1) as inputs
      returning name, id
  ), insert_documents as (
    insert into documents_sample(id, content)
      select id, content from insert_directories join unnest($1) as inputs using (name)
  ) select name, id from insert_directories
$$;

-- test
select * from insert_documents_quick_sample(array[
    row ('f1', 'nya')::insert_documents_quick_sample_inputs,
    row ('f2', 'nyamo')::insert_documents_quick_sample_inputs
  ], 1);

drop type if exists fetch_folder_sample_result cascade;

create type fetch_folder_sample_result as (
  id bigint,
  created_at timestamp,
  parent_id bigint,
  name text,
  children_count bigint
);
-- drop function if exists fetch_folder_sample;

create or replace function fetch_folder_sample(path text[])
returns setof fetch_folder_sample_result language sql stable
as $$
  with resolve_query as (
    select * from resolve_path_sample(path) where file_type = 'folder'
  ), count_query as (
    select count(*) as children_count from directories_sample
      join resolve_query on directories_sample.parent_id = resolve_query.id
  ) select
    resolve_query.id,
    resolve_query.created_at,
    resolve_query.parent_id,
    resolve_query.name,
    children_count
    from resolve_query join count_query on true
$$;

-- test
-- select * from fetch_folder_sample(array['A', 'B', 'B']);

drop type if exists fetch_document_sample_result cascade;

create type fetch_document_sample_result as (
  id bigint,
  created_at timestamp,
  parent_id bigint,
  name text,
  content text
);
-- drop function if exists fetch_document_sample;

create or replace function fetch_document_sample(path text[])
returns setof fetch_document_sample_result language sql stable
as $$
  select r.id, r.created_at, r.parent_id, r.name, content
  from resolve_path_sample(path) as r join documents_sample
   using (id) where file_type = 'document'
$$;

-- test
-- select * from fetch_document_sample(array['A', 'B', 'B', 'A']);

-- delete from directories_sample where id = 3;

-- drop function if exists fetch_folders_quick_sample;

create or replace function fetch_folders_quick_sample(
  names text[], parent_id bigint
) returns setof fetch_folder_sample_result
language sql stable as $$
  with find_query as (
    select * from directories_sample inner join unnest($1) as name using (name)
      where file_type = 'folder' and (
        parent_id = $2 or parent_id is null and $2 is null
  )), count_query as (
    select find_query.id as id, count(*) as children_count
      from directories_sample
        join find_query on directories_sample.parent_id = find_query.id
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
-- select * from fetch_folders_quick_sample(array['A', 'B', 'X'], 3);
-- select * from fetch_folders_quick_sample(array['A'], null);

create or replace function fetch_documents_quick_sample(
  names text[], parent_id bigint
) returns setof fetch_document_sample_result
language sql stable as $$
  select
    r.id, r.created_at, r.parent_id, r.name, content
  from directories_sample r
    inner join unnest($1) as name using (name)
    join documents_sample using (id)
      where file_type = 'document' and (
      parent_id = $2 or parent_id is null and $2 is null)
$$;

-- test
-- select * from fetch_documents_quick_sample(array['A', 'B', 'X', 'p'], 6);
