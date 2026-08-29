ALTER TABLE public.ordinances
ADD COLUMN resolutionNumber varchar,
ADD COLUMN verified boolean DEFAULT false;
