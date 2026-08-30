CREATE TYPE "ordinance_type" AS ENUM (
  'Head Maintainer',
  'Maintainer',
  'Data Collaborator',
  'Data Validator',
  'Tester'
);

ALTER TABLE public.ordinances
ADD COLUMN ordinance_type ordinance_type;
