ALTER TABLE public.discussion
  ADD COLUMN archive_by uuid REFERENCES public.users(id);
