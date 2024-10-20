drop TYPE IF EXISTS sample_file_type cascade;

CREATE TYPE sample_file_type AS ENUM ('folder', 'document');

DROP TABLE IF EXISTS documents_sample;

DROP TABLE IF EXISTS directories_sample CASCADE;

CREATE TABLE
  directories_sample (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    parent_id BIGINT NULL,
    file_type sample_file_type NULL,
    NAME TEXT NULL,
    CONSTRAINT directories_sample_parent_id_fkey FOREIGN KEY (parent_id)
      REFERENCES directories_sample (id)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT directories_sample_unique_name_parent_id UNIQUE NULLS NOT DISTINCT (NAME, parent_id));

CREATE TABLE
  documents_sample (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    content text null,
    CONSTRAINT documents_sample_id_fkey FOREIGN KEY (id)
      REFERENCES directories_sample (id)
      ON UPDATE CASCADE ON DELETE CASCADE);

CREATE INDEX directories_sample_id_hash_idx 
  ON directories_sample 
  USING HASH (id);

CREATE INDEX directories_sample_parent_id_hash_idx 
  ON directories_sample 
  USING HASH (parent_id);

CREATE INDEX directories_sample_name_hash_idx 
  ON directories_sample
  USING HASH (name);

insert into directories_sample (name, parent_id, file_type) values
  ('A', null, 'folder');

insert into directories_sample (name, parent_id, file_type) values
  ('A', 1, 'document'),
  ('B', 1, 'folder'),
  ('C', 1, 'document');

insert into directories_sample (name, parent_id, file_type) values
  ('A', 3, 'folder'),
  ('B', 3, 'folder');

insert into directories_sample (name, parent_id, file_type) values
  ('A', 5, 'folder');

insert into directories_sample (name, parent_id, file_type) values
  ('A', 6, 'document'),
  ('B', 6, 'document');

insert into documents_sample (id, content) values
  ('2', 'file 2'),
  ('4', 'file 2'),
  ('8', 'file 2'),
  ('9', 'file 2');

REVOKE ALL ON TABLE directories_sample from anon;

REVOKE ALL ON TABLE documents_sample from anon;
