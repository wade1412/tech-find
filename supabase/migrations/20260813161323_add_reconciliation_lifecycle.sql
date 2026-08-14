-- Add new columns for reconciliation monitoring
ALTER TABLE public.user_management_audit
  ADD COLUMN reconciled_at timestamptz,
  ADD COLUMN reconciled_by uuid,
  ADD COLUMN reconciliation_note text,
  ADD COLUMN last_alerted_at timestamptz,
  ADD COLUMN alert_count integer NOT NULL DEFAULT 0;

CREATE INDEX idx_user_management_audit_pending_reconciliation
  ON public.user_management_audit (created_at DESC)
  WHERE requires_reconciliation = true 
    AND reconciled_at IS NULL;


CREATE OR REPLACE FUNCTION public.resolve_user_management_reconciliation(p_audit_id uuid, p_resolution_note text)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE 
  v_requires_reconciliation boolean;
  v_reconciled_at timestamptz;

BEGIN
-- Check that the invoker has the owner role
IF NOT EXISTS (
  SELECT 1
  from public.user_profile
  WHERE id = auth.uid()
    AND role = 'owner'
) THEN
  RAISE EXCEPTION 'The rpc invoker does not have owner rights';
END IF;

-- Check that the note is not empty or null
IF (
  p_resolution_note IS NULL 
  OR TRIM(p_resolution_note) = ''
) THEN
  RAISE EXCEPTION 'Reconciliation note cannot be empty';
END IF;

-- Check that the audit records exists and get values into variables
SELECT requires_reconciliation, reconciled_at
INTO v_requires_reconciliation, v_reconciled_at
FROM public.user_management_audit
WHERE id = p_audit_id;

IF NOT FOUND THEN
  RAISE EXCEPTION 'Audit record with this id not found';
END IF;

-- Check if the incident requires reconciliation and is unresolved
IF(
  v_requires_reconciliation IS NOT TRUE
) THEN
  RAISE EXCEPTION 'Audit record does not require reconciliation';
END IF;

IF(
  v_reconciled_at IS NOT NULL
) THEN
  RAISE EXCEPTION 'Reconciliation incident is already resolved';
END IF;

-- Update the record: checking the status before update to avoid race conditions
UPDATE public.user_management_audit
SET reconciled_by = auth.uid(), reconciliation_note = TRIM(p_resolution_note), reconciled_at = now()
WHERE id = p_audit_id 
  AND requires_reconciliation IS TRUE 
  AND reconciled_at IS NULL;

IF NOT FOUND THEN 
  RAISE EXCEPTION 'Could not update the audit record';
END IF;

END;
$$;

REVOKE ALL ON FUNCTION public.resolve_user_management_reconciliation(uuid, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.resolve_user_management_reconciliation(uuid, text) TO authenticated;