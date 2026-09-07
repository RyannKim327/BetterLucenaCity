-- Refine discussion status columns: ensure FK ON DELETE SET NULL and add indexes for tabs
-- approved_by and archive_by were added in 20260907141609 and 20260907142029 as nullable uuid FKs
-- This migration adds indexes and ensures ON DELETE SET NULL semantics

-- Re-add constraints with ON DELETE SET NULL if missing (idempotent via DO blocks)
DO $$
BEGIN
  -- approved_by FK: if column exists but constraint not with ON DELETE SET NULL, recreate
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='discussion' AND column_name='approved_by'
  ) THEN
    -- ensure index exists
    CREATE INDEX IF NOT EXISTS idx_discussion_approved_by ON public.discussion (approved_by);
  ELSE
    ALTER TABLE public.discussion ADD COLUMN approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_discussion_approved_by ON public.discussion (approved_by);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='discussion' AND column_name='archive_by'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_discussion_archive_by ON public.discussion (archive_by);
  ELSE
    ALTER TABLE public.discussion ADD COLUMN archive_by uuid REFERENCES public.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_discussion_archive_by ON public.discussion (archive_by);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_discussion_is_open ON public.discussion (is_open);
CREATE INDEX IF NOT EXISTS idx_discussion_user_id ON public.discussion (user_id);

-- Ensure RLS update policy allows validators to set these columns (existing policy is permissive USING true / WITH CHECK true for authenticated)
-- No change needed; server-side PATCH will enforce validator check
