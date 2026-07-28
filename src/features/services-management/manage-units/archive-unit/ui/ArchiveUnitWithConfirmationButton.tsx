import { useState } from "react";
import { useNavigate } from "react-router";
import type { Unit } from "../../../../../entities/unit/unit.types";
import { archiveEntityButtonStyle } from "../../../../../shared/styles/styles";
import ArchiveButton from "../../../../../shared/ui/ArchiveButton";
import ConfirmArchiveEntityDialog from "../../../../../shared/ui/ConfirmArchiveEntityDialog";
import { useAuthPermissions } from "../../../../auth/model/useAuthPermissions";
import { useArchiveUnitMutation } from "../model/useUnitArchiveMutations";

function ArchiveUnitWithConfirmationButton({ unit }: { unit: Unit }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveServices } = useAuthPermissions();
  const archiveMutation = useArchiveUnitMutation();

  if (!canArchiveServices) return null;

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(unit.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/services", { replace: true });
      },
    });
  };

  return (
    <>
      <ArchiveButton
        label="Archive Unit"
        handleClick={() => {
          archiveMutation.reset();
          setIsDialogOpen(true);
        }}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="unit"
        entityName={unit.name}
        confirmationMessageSubtext="The unit and its related configuration will be preserved, but it will be removed from Home filters and service-management lists. You can restore it at any time."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveUnitWithConfirmationButton;
