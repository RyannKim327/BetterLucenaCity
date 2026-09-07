ALTER TABLE public.discussion
  ADD COLUMN approved_by uuid REFERENCES public.users(id);
