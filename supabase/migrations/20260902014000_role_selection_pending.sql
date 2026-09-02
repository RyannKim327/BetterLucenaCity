-- Role selection + pending approval
-- 1) Ensure approved defaults to false and existing nulls become false
ALTER TABLE public.users ALTER COLUMN approved SET DEFAULT false;
UPDATE public.users SET approved = false WHERE approved IS NULL;

-- 2) Update handle_new_user to explicitly insert approved = false, user_type = null
--    (keeps new users pending until Maintainer approves)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_username text;
BEGIN
  generated_username := COALESCE(
    NEW.raw_user_meta_data ->> 'user_name',
    split_part(NEW.email, '@', 1)
  );

  IF EXISTS (
    SELECT 1
    FROM public.users
    WHERE username = generated_username
  ) THEN
    generated_username := generated_username || '_' || substr(NEW.id::text, 1, 8);
  END IF;

  INSERT INTO public.users (
    id,
    email,
    first_name,
    last_name,
    username,
    avatar_url,
    user_type,
    approved
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    generated_username,
    NEW.raw_user_meta_data ->> 'avatar_url',
    NULL,
    false
  );

  RETURN NEW;
END;
$$;

-- Ensure trigger exists (drop + recreate idempotently)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
