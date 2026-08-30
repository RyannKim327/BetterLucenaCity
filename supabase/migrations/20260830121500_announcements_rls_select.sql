ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Announcements are publicly readable" ON public.announcements;
CREATE POLICY "Announcements are publicly readable"
  ON public.announcements
  FOR SELECT
  TO public
  USING (true);
