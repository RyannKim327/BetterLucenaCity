ALTER TABLE public.legals
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS verification varchar DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_name varchar;

ALTER TABLE public.legals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Legals are publicly readable" ON public.legals;
CREATE POLICY "Legals are publicly readable"
  ON public.legals
  FOR SELECT
  TO public
  USING (true);

INSERT INTO public.legals (title, content, summary, reference, resolution_number, ordinance_type, proclamation_date, verification, source_url, source_name, approved_by) VALUES
  (
    'Charter of the City of Lucena',
    E'An Act Creating the City of Lucena. Lapsed into law on June 17, 1961; the city was formally inaugurated on August 20, 1961, now celebrated annually as Araw ng Lucena.',
    E'An Act Creating the City of Lucena. Lapsed into law on June 17, 1961; the city was formally inaugurated on August 20, 1961, now celebrated annually as Araw ng Lucena.',
    'Republic Act No. 3271',
    NULL,
    'national_law',
    '1961-06-17 00:00:00+00',
    'verified',
    'https://lawphil.net/statutes/repacts/ra1961/ra_3271_1961.html',
    'LawPhil Project',
    NULL
  ),
  (
    'Local Government Code of 1991',
    E'The framework law for all LGUs. Lucena was declared a highly urbanized city effective July 1, 1991, gaining administrative independence from the Province of Quezon while remaining part of its legislative district.',
    E'The framework law for all LGUs. Lucena was declared a highly urbanized city effective July 1, 1991, gaining administrative independence from the Province of Quezon while remaining part of its legislative district.',
    'Republic Act No. 7160',
    NULL,
    'national_law',
    '1991-10-10 00:00:00+00',
    'verified',
    'https://lawphil.net/statutes/repacts/ra1991/ra_7160_1991.html',
    'LawPhil Project',
    NULL
  ),
  (
    'An Ordinance Authorizing the City Mayor to Promulgate and Execute on an Experimental Basis a Traffic Rerouting Scheme in Lucena City',
    E'Approved on third and final reading by the 20th Sangguniang Panlungsod, this ordinance institutes a three-month experimental traffic rerouting scheme effective February 2, 2026. It designates one-way routes and looped patterns for tricycles and public utility jeepneys through inner streets (e.g., Enriquez, Ravanzo, Granja, Del Pilar, Gomez, Merchan, Barcelona, Recto) and prescribes graduated penalties — written warning (first offense), community service plus ₱200 (second), and community service plus ₱400 (third and succeeding) — for ignoring one-way signs, counterflowing, and illegal parking.',
    E'Approved on third and final reading by the 20th Sangguniang Panlungsod, this ordinance institutes a three-month experimental traffic rerouting scheme effective February 2, 2026.',
    'Ordinance No. 2915',
    NULL,
    'city_ordinance',
    '2026-01-15 00:00:00+00',
    'verified',
    'https://www.sentineltimes.net/2026/01/lucena-city-oks-ordinance-for.html',
    'Sentinel Times Quezon',
    NULL
  ),
  (
    'Lucena City Animal Code',
    E'A proposed ordinance establishing the Lucena City Animal Code, designed to promote animal welfare, responsible pet ownership, and care for animals in the city. The proposal was the subject of a public hearing by the Committee on Laws, Rules and Human Rights on May 14, 2026, in coordination with the City Veterinarian''s Office, the Bureau of Animal Industry, and pet shop owners.',
    E'A proposed ordinance establishing the Lucena City Animal Code, designed to promote animal welfare, responsible pet ownership, and care for animals in the city.',
    'Legislative Proposal No. 20-02-274',
    NULL,
    'city_ordinance',
    NULL,
    'sample',
    'https://www.govserv.org/PH/Lucena/102387802658046/Sangguniang-Panlungsod---Lucena-City',
    'Sangguniang Panlungsod - Lucena City',
    NULL
  ),
  (
    'A Resolution Authorizing the City Mayor to Enter Into a Memorandum of Agreement with PHIVOLCS for a Continuous GPS Receiver',
    E'A city resolution authorizing the City Mayor, on behalf of the City Government of Lucena, to enter into a Memorandum of Agreement with the Philippine Institute of Volcanology and Seismology (PHIVOLCS) for the installation and maintenance of a continuous Global Positioning System (GPS) receiver. The device supports measurement and monitoring of ground movement within a 50-kilometer radius, strengthening the city''s earthquake and geologic-hazard preparedness.',
    E'A city resolution authorizing the City Mayor to enter into a Memorandum of Agreement with PHIVOLCS for a continuous GPS receiver, supporting earthquake and geologic-hazard preparedness.',
    'Legislative Proposal No. 20-05-348',
    NULL,
    'city_resolution',
    NULL,
    'sample',
    'https://www.govserv.org/PH/Lucena/102387802658046/Sangguniang-Panlungsod---Lucena-City',
    'Sangguniang Panlungsod - Lucena City',
    NULL
  ),
  (
    'Resolutions Authorizing Grant of Right of Way to Meralco over City Properties',
    E'Resolutions authorizing the City Mayor, on behalf of the City Government of Lucena, to enter into a Grant of Right of Way with Meralco over portions of city-owned property located at Barangay Marketview, and under Meralco Project No. X26041057221 — supporting power infrastructure serving the city.',
    E'Resolutions authorizing the City Mayor to enter into a Grant of Right of Way with Meralco over city-owned property at Barangay Marketview and under Meralco Project No. X26041057221.',
    'Legislative Proposals No. 20-05-352 & 20-05-353',
    NULL,
    'city_resolution',
    NULL,
    'sample',
    'https://www.govserv.org/PH/Lucena/102387802658046/Sangguniang-Panlungsod---Lucena-City',
    'Sangguniang Panlungsod - Lucena City',
    NULL
  );
