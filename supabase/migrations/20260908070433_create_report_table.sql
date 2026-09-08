CREATE TABLE report (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  title varchar NOT NULL,
  content text NOT NULL,
  type varchar,
  report_source jsonb
);
