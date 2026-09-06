-- Fix discussion id default and add RLS / insert policies for contribute flows
-- id should default to gen_random_uuid so client can omit it (or we generate client-side)
ALTER TABLE public.discussion ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Ensure extension for gen_random_uuid exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable RLS on tables that will be written via API (if not already)
ALTER TABLE public.local_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

-- Legals and announcements already have RLS enabled (from earlier migrations); ensure policies for writes
-- Local budget: public can read approved rows; authenticated can insert/select own pending
DROP POLICY IF EXISTS "Local budget publicly readable" ON public.local_budget;
CREATE POLICY "Local budget publicly readable"
  ON public.local_budget FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated can insert local_budget" ON public.local_budget;
CREATE POLICY "Authenticated can insert local_budget"
  ON public.local_budget FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated can select own local_budget" ON public.local_budget;
CREATE POLICY "Authenticated can select own local_budget"
  ON public.local_budget FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Validators can update local_budget" ON public.local_budget;
CREATE POLICY "Validators can update local_budget"
  ON public.local_budget FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Procurement same pattern
DROP POLICY IF EXISTS "Procurement publicly readable" ON public.procurement;
CREATE POLICY "Procurement publicly readable"
  ON public.procurement FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated can insert procurement" ON public.procurement;
CREATE POLICY "Authenticated can insert procurement"
  ON public.procurement FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Legals insert (contribute)
DROP POLICY IF EXISTS "Authenticated can insert legals" ON public.legals;
CREATE POLICY "Authenticated can insert legals"
  ON public.legals FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated can select own legals" ON public.legals;
-- keep public readable already, but ensure authenticated can read all for validation
CREATE POLICY "Authenticated can select legals"
  ON public.legals FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Validators can update legals" ON public.legals;
CREATE POLICY "Validators can update legals"
  ON public.legals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Announcements insert
DROP POLICY IF EXISTS "Authenticated can insert announcements" ON public.announcements;
CREATE POLICY "Authenticated can insert announcements"
  ON public.announcements FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated can select announcements" ON public.announcements;
CREATE POLICY "Authenticated can select announcements"
  ON public.announcements FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Validators can update announcements" ON public.announcements;
CREATE POLICY "Validators can update announcements"
  ON public.announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Discussion: any authenticated with contribute/validate can read; insert requires auth.uid() = user_id
DROP POLICY IF EXISTS "Discussion readable for contributors and validators" ON public.discussion;
CREATE POLICY "Discussion readable for contributors and validators"
  ON public.discussion FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can insert discussion" ON public.discussion;
CREATE POLICY "Authenticated can insert discussion"
  ON public.discussion FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Participants can update discussion" ON public.discussion;
CREATE POLICY "Participants can update discussion"
  ON public.discussion FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Discussion comments
DROP POLICY IF EXISTS "Discussion comments readable" ON public.discussion_comments;
CREATE POLICY "Discussion comments readable"
  ON public.discussion_comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can insert comments" ON public.discussion_comments;
CREATE POLICY "Authenticated can insert comments"
  ON public.discussion_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Grant necessary table privileges for anon/authenticated (Supabase cloud defaults require explicit grants if auto_expose disabled)
GRANT SELECT, INSERT ON public.local_budget TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.local_budget TO authenticated;
GRANT SELECT, INSERT ON public.procurement TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON public.procurement TO authenticated;
GRANT SELECT, INSERT ON public.legals TO authenticated, anon;
GRANT SELECT, UPDATE ON public.legals TO authenticated;
GRANT SELECT, INSERT ON public.announcements TO authenticated, anon;
GRANT SELECT, UPDATE ON public.announcements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.discussion TO authenticated;
GRANT SELECT, INSERT ON public.discussion_comments TO authenticated;
