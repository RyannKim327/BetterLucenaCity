-- data_source as string[] of reference URLs (like https://google.com), supports comma or Add link input
-- Ensure extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- legals: add data_source if missing (reference links for validation)
ALTER TABLE public.legals ADD COLUMN IF NOT EXISTS data_source jsonb DEFAULT '[]'::jsonb;
-- announcements: add data_source if missing
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS data_source jsonb DEFAULT '[]'::jsonb;

-- Backfill existing legals source_url into data_source where empty
UPDATE public.legals SET data_source = jsonb_build_array(source_url) WHERE (data_source IS NULL OR data_source = '[]'::jsonb) AND source_url IS NOT NULL AND source_url <> '';

-- Validate that future data_source values are string[] of http/https URLs (optional check constraint)
-- Note: keep permissive — application validates via regex /^https?:\/\/.+/ and URL constructor
-- Add comment for documentation
COMMENT ON COLUMN public.legals.data_source IS 'Reference links — string[] of URLs like https://google.com, entered via comma or Add link. Validated as https:// URLs.';
COMMENT ON COLUMN public.announcements.data_source IS 'Reference links — string[] of URLs like https://google.com, entered via comma or Add link.';
COMMENT ON COLUMN public.local_budget.data_source IS 'Reference links — string[] of URLs like https://google.com, entered via comma or Add link.';
COMMENT ON COLUMN public.discussion.data_source IS 'Reference links — string[] of URLs like https://google.com, entered via comma or Add link. Linked from legals/announcements/local_budget submissions.';
COMMENT ON COLUMN public.procurement.data_source IS 'Reference links — string[] of URLs like https://google.com, entered via comma or Add link.';
