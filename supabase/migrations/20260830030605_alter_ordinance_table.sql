ALTER TABLE public.ordinances
RENAME TO legals;


ALTER TABLE public.legals
ADD COLUMN approved_by uuid
REFERENCES public.users(id);
