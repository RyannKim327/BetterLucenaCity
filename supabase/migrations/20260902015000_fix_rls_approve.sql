-- Fix RLS to allow role selection (user_type null -> choose role) with pending approved=false
-- and allow Maintainers to approve others.

-- Helper to check if current user is a maintainer (approved)
CREATE OR REPLACE FUNCTION public.is_maintainer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND user_type IN ('Head Maintainer', 'Maintainer')
    AND approved = true
  );
$$;

-- Drop old update policy and recreate with maintainer privilege
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Maintainers can update any profile" ON public.users;

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Maintainers can update any profile"
  ON public.users FOR UPDATE
  USING (public.is_maintainer())
  WITH CHECK (public.is_maintainer());

-- Enforce that non-maintainers cannot self-approve or self-promote to Maintainer/Head Maintainer
CREATE OR REPLACE FUNCTION public.enforce_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Normalize empty string -> NULL (defensive; PostgREST may send "" for nullable enum)
  IF NEW.user_type::text = '' THEN
    NEW.user_type := NULL;
  END IF;

  -- Block self-approval: unapproved -> approved true only if maintainer
  IF COALESCE(OLD.approved, false) = false AND NEW.approved = true THEN
    IF NOT public.is_maintainer() THEN
      NEW.approved := false;
    END IF;
  END IF;

  -- Block self-elevation to Maintainer / Head Maintainer when not already that role
  -- FIX: cast enum to text before COALESCE to avoid 22P02 invalid input value for enum user_type: ""
  IF OLD.id = auth.uid()
     AND NEW.user_type::text IN ('Head Maintainer', 'Maintainer')
     AND COALESCE(OLD.user_type::text, '') NOT IN ('Head Maintainer', 'Maintainer') THEN
    IF NOT public.is_maintainer() THEN
      NEW.user_type := OLD.user_type;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_approved_before_update ON public.users;
CREATE TRIGGER enforce_approved_before_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_approved();
