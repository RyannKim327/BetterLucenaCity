DROP POLICY IF EXISTS "Anyone can view approved evacuation centers" ON public.evacuation_centers;
CREATE POLICY "Anyone can view approved evacuation centers"
  ON public.evacuation_centers FOR SELECT TO anon
  USING (approved_by IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can view evacuation centers" ON public.evacuation_centers;
CREATE POLICY "Authenticated users can view evacuation centers"
  ON public.evacuation_centers FOR SELECT TO authenticated
  USING (true);
