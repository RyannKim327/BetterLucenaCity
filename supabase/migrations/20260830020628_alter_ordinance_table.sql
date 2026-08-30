DROP TYPE IF EXISTS ordinance_type CASCADE;

CREATE TYPE "ordinance_type" AS ENUM (
  'national_law',
  'city_ordinance',
  'city_resolution',
  'executive_order',
  'memorandum'
);

ALTER TABLE public.ordinances
ADD COLUMN ordinance_type ordinance_type;
