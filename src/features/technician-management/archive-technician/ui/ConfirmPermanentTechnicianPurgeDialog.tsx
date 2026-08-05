import type { Technician } from "../../../../entities/technician/technician.types";
import ConfirmPermanentPurgeDialog from "../../../../shared/ui/ConfirmPermanentPurgeDialog";

interface ConfirmPermanentTechnicianPurgeDialogProps {
  technician: Technician | null;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmPermanentTechnicianPurgeDialog({
  technician,
  isPending,
  error,
  onClose,
  onConfirm,
}: ConfirmPermanentTechnicianPurgeDialogProps) {
  return (
    <ConfirmPermanentPurgeDialog
      confirmationInputLabel="Technician alias confirmation"
      entityLabel="technician"
      entityName={technician?.alias ?? null}
      error={error}
      impactMessage={
        <>
          Purging <strong>{technician?.alias}</strong> permanently removes the
          profile, service zones, skills, and ignore-list items.
        </>
      }
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmPermanentTechnicianPurgeDialog;
