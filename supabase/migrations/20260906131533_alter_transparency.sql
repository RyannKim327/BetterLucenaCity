ALTER TABLE public.local_budget
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.procurement
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_local_budget_approved_by ON public.local_budget (approved_by);
CREATE INDEX IF NOT EXISTS idx_procurement_approved_by ON public.procurement (approved_by);
CREATE INDEX IF NOT EXISTS idx_announcements_approved_by ON public.announcements (approved_by);

