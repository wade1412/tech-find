ALTER TABLE public.technician
ADD COLUMN can_provide_installation boolean NOT NULL DEFAULT false;

GRANT UPDATE (can_provide_installation) on public.technician TO authenticated;
