DO $$
DECLARE
  v_announcement_id int;
  v_user_id uuid;
  v_discussion_id uuid := 'e2f6b6d0-6b3c-4f1e-9a2d-7c5f8a0b1d34'::uuid;
  v_sources jsonb := '[
    "https://www.pagcor.ph/press-releases/pagcor-releases-P150-M-to-build-more-evacuation-centers-in-bicol-and-quezon.php",
    "https://www.facebook.com/DRRMOLucena",
    "https://quezon.gov.ph/pdrrmo/service"
  ]'::jsonb;
BEGIN
  SELECT id INTO v_announcement_id
  FROM public.announcements
  WHERE title = 'Listahan ng Evacuation Centers sa Lucena City'
  LIMIT 1;

  IF v_announcement_id IS NULL THEN
    INSERT INTO public.announcements (title, content, date_added, data_source, approved_by)
    VALUES (
      'Listahan ng Evacuation Centers sa Lucena City',
      'Mga kilalang evacuation center sa Lucena City: Lucena City Evacuation Center (Mayao Crossing), Lucena City Evacuation Center (Ibabang Dupay), Ibabang Talim Multi-Purpose Evacuation Center, Cotta Multi-Purpose Evacuation Center, Barangay 7 Evacuation Center, at Quezon Convention Center. Ang mga coordinates ay reference points; i-verify sa barangay o sa Lucena LDRRMO (0970 128 5078) ang eksaktong meeting point bago mag-evacuate.',
      now(),
      v_sources,
      NULL
    )
    RETURNING id INTO v_announcement_id;
  END IF;

  SELECT id INTO v_user_id FROM public.users WHERE username = 'RyannKim327' LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.discussion (
    id, user_id, title, content, data_source, type, reference_id,
    date_added, is_open, approved_by, archive_by
  )
  VALUES (
    v_discussion_id,
    v_user_id,
    'Evacuation centers data for Lucena City — for validation',
    'Pinagsama ang listahan ng mga evacuation center sa Lucena City kasama ang barangay at latitude/longitude para sa emergency preparedness page. Sanggunian: PAGCOR (Ibabang Talim MPEC), Lucena LDRRMO at OCD CALABARZON (Mayao Crossing at Ibabang Dupay), DILG SubayBAYAN (Cotta MPEC), at Philippine Star (Quezon Convention Center). Paki-verify ang mga pangalan at coordinates bago i-approve.',
    v_sources,
    'announcements',
    v_announcement_id,
    now(),
    true,
    NULL,
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
END $$;
