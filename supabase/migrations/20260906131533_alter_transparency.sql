ALTER TABLE public.local_budget
  ADD COLUMN approved_by uuid REFERENCES public.users(id);

ALTER TABLE public.procurement
  ADD COLUMN approved_by uuid REFERENCES public.users(id);

ALTER TABLE public.announcements
  ADD COLUMN approved_by uuid REFERENCES public.users(id);

