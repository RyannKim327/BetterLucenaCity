ALTER TABLE public.discussion
ALTER COLUMN date_added SET DEFAULT now();

ALTER TABLE public.announcements
ALTER COLUMN date_added SET DEFAULT now();

ALTER TABLE public.discussion_comments
ALTER COLUMN date_added SET DEFAULT now();

