ALTER TABLE public.evacuation_centers
  ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS date_added timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS data_source jsonb NOT NULL DEFAULT '[]'::jsonb;

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM public.users WHERE username = 'RyannKim327' LIMIT 1;
  IF v_user_id IS NOT NULL THEN
    UPDATE public.evacuation_centers
    SET approved_by = v_user_id,
        submitted_by = v_user_id
    WHERE approved_by IS NULL
      AND name IN (
        'Lucena City Evacuation Center (Mayao Crossing)',
        'Lucena City Evacuation Center (Ibabang Dupay)',
        'Ibabang Talim Multi-Purpose Evacuation Center',
        'Cotta Multi-Purpose Evacuation Center',
        'Barangay 7 Evacuation Center',
        'Quezon Convention Center'
      );
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can view evacuation centers" ON public.evacuation_centers;
CREATE POLICY "Anyone can view approved evacuation centers"
  ON public.evacuation_centers FOR SELECT
  USING (approved_by IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can submit evacuation centers" ON public.evacuation_centers;
CREATE POLICY "Authenticated users can submit evacuation centers"
  ON public.evacuation_centers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Validators can moderate evacuation centers" ON public.evacuation_centers;
CREATE POLICY "Validators can moderate evacuation centers"
  ON public.evacuation_centers FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

GRANT SELECT ON public.evacuation_centers TO anon, authenticated;
GRANT INSERT, UPDATE ON public.evacuation_centers TO authenticated;

DROP TRIGGER IF EXISTS lock_evacuation_centers_on_approval ON public.evacuation_centers;
CREATE TRIGGER lock_evacuation_centers_on_approval
  BEFORE UPDATE ON public.evacuation_centers
  FOR EACH ROW EXECUTE FUNCTION public.prevent_edit_if_approved();
