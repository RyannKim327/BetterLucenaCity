-- Ensure consistent timestamptz type (announcements originally timestamp without tz) and idempotent defaults
ALTER TABLE public.announcements
  ALTER COLUMN date_added TYPE timestamptz USING date_added::timestamptz;

ALTER TABLE public.discussion
ALTER COLUMN date_added SET DEFAULT now();

ALTER TABLE public.announcements
ALTER COLUMN date_added SET DEFAULT now();

ALTER TABLE public.discussion_comments
ALTER COLUMN date_added SET DEFAULT now();

