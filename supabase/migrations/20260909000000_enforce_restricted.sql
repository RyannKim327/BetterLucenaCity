-- Enforce restricted/unrestrict permissions at DB level
-- Maintainers can restrict (false -> true) but only Head Maintainers can unrestrict (true -> false)
-- Also prevent Maintainers from restricting Head Maintainers

CREATE OR REPLACE FUNCTION public.is_head_maintainer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND user_type = 'Head Maintainer'
    AND approved = true
  );
$$;

CREATE OR REPLACE FUNCTION public.enforce_restricted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only care when restricted changes
  IF OLD.restricted IS DISTINCT FROM NEW.restricted THEN
    -- Restricting: false -> true
    IF COALESCE(OLD.restricted, false) = false AND NEW.restricted = true THEN
      -- Must be at least a maintainer
      IF NOT public.is_maintainer() THEN
        RAISE EXCEPTION 'Only Maintainers or Head Maintainers can restrict users.' USING ERRCODE = '42501';
      END IF;
      -- Prevent maintainers from restricting Head Maintainers (only head can restrict head)
      IF OLD.user_type = 'Head Maintainer' AND NOT public.is_head_maintainer() THEN
        RAISE EXCEPTION 'Cannot restrict a Head Maintainer.' USING ERRCODE = '42501';
      END IF;
    END IF;

    -- Unrestricting: true -> false
    IF COALESCE(OLD.restricted, false) = true AND NEW.restricted = false THEN
      IF NOT public.is_head_maintainer() THEN
        RAISE EXCEPTION 'Only Head Maintainers can unrestrict users.' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;

  -- Prevent non-head from assigning Head Maintainer role via direct update
  -- If you want to allow Head Maintainer assignment via SQL, comment this block
  IF OLD.user_type IS DISTINCT FROM NEW.user_type THEN
    IF NEW.user_type = 'Head Maintainer' AND NOT public.is_head_maintainer() THEN
      -- Allow bootstrap when there is no head maintainer yet? Check if any head exists
      -- If no head exists, allow? For safety, still block and require manual superuser insert
      RAISE EXCEPTION 'Only Head Maintainers can assign Head Maintainer role.' USING ERRCODE = '42501';
    END IF;
    -- Also protect existing Head Maintainer role change by non-head
    IF OLD.user_type = 'Head Maintainer' AND NOT public.is_head_maintainer() THEN
      RAISE EXCEPTION 'Cannot change role of a Head Maintainer.' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_restricted_before_update ON public.users;
CREATE TRIGGER enforce_restricted_before_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_restricted();
