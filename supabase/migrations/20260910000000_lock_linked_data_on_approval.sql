-- Lock linked data after approval: collector may edit while discussion is open, but once approved (done) it is immutable.
-- Covers announcements, legals, local_budget, procurement, and discussion itself.
-- Allows the approval transition itself (approved_by null -> not null) and unapprove (not null -> null),
-- but blocks any other column changes when OLD.approved_by IS NOT NULL.

CREATE OR REPLACE FUNCTION public.prevent_edit_if_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the row is already approved (OLD.approved_by IS NOT NULL) and the caller is not changing approved_by,
  -- block any other edits. Approval itself (null -> uuid) and unapprove (uuid -> null) are allowed,
  -- but they must not piggyback other column changes in the same statement.

  -- Only enforce when OLD is approved
  IF OLD.approved_by IS NOT NULL THEN
    -- If approved_by is unchanged, any other change is forbidden
    IF NEW.approved_by IS NOT DISTINCT FROM OLD.approved_by THEN
      RAISE EXCEPTION 'Record is approved and locked — cannot be edited after validation. Create a correction discussion if needed.' USING ERRCODE = '42501';
    ELSE
      -- approved_by is changing (approve -> unapprove or vice versa). Allow only if no other column changed
      -- We need to compare TG_TABLE_NAME-specific columns generically: if row as json differs besides approved_by, block.
      -- Use to_jsonb diff: remove approved_by from both and compare
      IF (to_jsonb(OLD) - 'approved_by' - 'updated_at') IS DISTINCT FROM (to_jsonb(NEW) - 'approved_by' - 'updated_at') THEN
        RAISE EXCEPTION 'Cannot modify content of an approved record — unapprove first, then edit.' USING ERRCODE = '42501';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Announcements: lock after approved_by set
DROP TRIGGER IF EXISTS lock_announcements_on_approval ON public.announcements;
CREATE TRIGGER lock_announcements_on_approval
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.prevent_edit_if_approved();

-- Legals (ordinances) — referenced as legals table
DROP TRIGGER IF EXISTS lock_legals_on_approval ON public.legals;
CREATE TRIGGER lock_legals_on_approval
  BEFORE UPDATE ON public.legals
  FOR EACH ROW EXECUTE FUNCTION public.prevent_edit_if_approved();

-- Local budget
DROP TRIGGER IF EXISTS lock_local_budget_on_approval ON public.local_budget;
CREATE TRIGGER lock_local_budget_on_approval
  BEFORE UPDATE ON public.local_budget
  FOR EACH ROW EXECUTE FUNCTION public.prevent_edit_if_approved();

-- Procurement
DROP TRIGGER IF EXISTS lock_procurement_on_approval ON public.procurement;
CREATE TRIGGER lock_procurement_on_approval
  BEFORE UPDATE ON public.procurement
  FOR EACH ROW EXECUTE FUNCTION public.prevent_edit_if_approved();

-- Discussion itself: lock title/content/data_source once approved
-- Note: discussion has is_open, approved_by, archive_by — same rule: once approved, linked metadata is frozen
DROP TRIGGER IF EXISTS lock_discussion_on_approval ON public.discussion;
CREATE TRIGGER lock_discussion_on_approval
  BEFORE UPDATE ON public.discussion
  FOR EACH ROW EXECUTE FUNCTION public.prevent_edit_if_approved();

COMMENT ON FUNCTION public.prevent_edit_if_approved() IS 'Collector may edit linked data while thread is open; once approved_by IS NOT NULL the record is immutable until unapproved.';
