ALTER TABLE public.unit
ADD COLUMN can_be_installed boolean NOT NULL DEFAULT false;

GRANT UPDATE (can_be_installed) on public.unit TO authenticated;