ALTER TABLE public.discussion
  ALTER COLUMN reference_id DROP NOT NULL;

ALTER TABLE public.discussion
  ADD COLUMN IF NOT EXISTS reference_uuid uuid;

COMMENT ON COLUMN public.discussion.reference_uuid IS 'UUID reference for linked records whose primary key is uuid (e.g. evacuation_centers).';
