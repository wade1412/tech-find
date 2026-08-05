import type { Unit } from "../../../../../entities/unit/unit.types";
import ConfirmPermanentPurgeDialog from "../../../../../shared/ui/ConfirmPermanentPurgeDialog";

interface ConfirmPermanentUnitPurgeDialogProps {
  error: Error | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unit: Unit | null;
}

function ConfirmPermanentUnitPurgeDialog({
  error,
  isPending,
  onClose,
  onConfirm,
  unit,
}: ConfirmPermanentUnitPurgeDialogProps) {
  return (
    <ConfirmPermanentPurgeDialog
      confirmationInputLabel="Unit name confirmation"
      entityLabel="unit"
      entityName={unit?.name ?? null}
      error={error}
      impactMessage={
        <>
          Purging <strong>{unit?.name}</strong> permanently removes the unit,
          its specific issues, technician skills, and ignore-list references.
        </>
      }
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmPermanentUnitPurgeDialog;
