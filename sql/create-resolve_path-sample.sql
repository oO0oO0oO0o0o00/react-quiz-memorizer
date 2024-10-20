-- DROP FUNCTION if exists resolve_path(text[]);

create or replace function resolve_path_sample(path text[])
returns setof directories_sample
language sql stable
as $$
  WITH RECURSIVE path_cte AS (
    SELECT
      *,
      ARRAY[name] AS PATH
    FROM directories_sample
    WHERE name = $1[1] and parent_id is null -- root
    UNION ALL
    SELECT
      d.*,
      p.path || d.name
    FROM public.directories_sample d
      INNER JOIN path_cte p ON d.parent_id = p.id
  ) SELECT id, created_at, parent_id, file_type, name FROM path_cte
  WHERE PATH = $1 LIMIT 1
$$;

select * from resolve_path_sample(array['A', 'B', 'B', 'A']);
