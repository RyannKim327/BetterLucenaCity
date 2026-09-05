-- Fix enforce_approved() enum comparison bug (22P02: invalid input value for enum user_type: "")
-- Root cause: COALESCE(OLD.user_type, '') tries to cast '' to enum user_type, which is invalid.
-- Fix: cast enum to text before COALESCE / IN checks, and normalize empty-string to NULL.

CREATE OR REPLACE FUNCTION public.enforce_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Normalize empty string -> NULL (defensive; PostgREST may send "" for nullable enum)
  -- Note: if PG rejects '' before trigger, this won't fire, but handles cases where text was coerced
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
  -- Use ::text to avoid enum vs '' coercion error
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
