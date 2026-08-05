import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import ConfirmPermanentPurgeDialog from "../../../../shared/ui/ConfirmPermanentPurgeDialog";

interface ConfirmPermanentServiceZonePurgeDialogProps {
  error: Error | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  zone: ServiceZone | null;
}
function ConfirmPermanentServiceZonePurgeDialog({
  error,
  isPending,
  onClose,
  onConfirm,
  zone,
}: ConfirmPermanentServiceZonePurgeDialogProps) {
  return (
    <ConfirmPermanentPurgeDialog
      confirmationInputLabel="Service zone name confirmation"
      entityLabel="zone"
      entityName={zone?.name ?? null}
      error={error}
      impactMessage={
        <>
          Purging <strong>{zone?.name}</strong> permanently removes the service
          zone and its technician relations.
        </>
      }
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmPermanentServiceZonePurgeDialog;
