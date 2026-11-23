CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.evacuation_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  barangay text NOT NULL,
  latitude double precision NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude double precision NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  UNIQUE (name, barangay)
);

ALTER TABLE public.evacuation_centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view evacuation centers" ON public.evacuation_centers;
CREATE POLICY "Anyone can view evacuation centers"
  ON public.evacuation_centers FOR SELECT
  USING (true);

GRANT SELECT ON public.evacuation_centers TO anon, authenticated;

INSERT INTO public.evacuation_centers (name, barangay, latitude, longitude) VALUES
  ('Lucena City Evacuation Center (Mayao Crossing)', 'Mayao Crossing', 13.9257621, 121.6217745),
  ('Lucena City Evacuation Center (Ibabang Dupay)', 'Ibabang Dupay', 13.9413972, 121.6235766),
  ('Ibabang Talim Multi-Purpose Evacuation Center', 'Ibabang Talim', 13.9157046, 121.5782202),
  ('Cotta Multi-Purpose Evacuation Center', 'Cotta', 13.9167742, 121.6064396),
  ('Barangay 7 Evacuation Center', 'Brgy. 7', 13.9332718, 121.6118396),
  ('Quezon Convention Center', 'Brgy. 10', 13.9284291, 121.6137405)
ON CONFLICT (name, barangay) DO NOTHING;
