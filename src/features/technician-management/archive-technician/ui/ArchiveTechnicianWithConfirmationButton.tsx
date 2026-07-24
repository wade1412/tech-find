import { useState } from "react";
import { useNavigate } from "react-router";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveTechnicianMutation } from "../model/useTechnicianArchiveMutations";
import ConfirmArchiveEntityDialog from "../../../../shared/ui/ConfirmArchiveEntityDialog";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { archiveEntityButtonStyle } from "../../../../shared/styles/styles";

interface ArchiveTechnicianWithConfirmationButtonProps {
  technician: Technician;
}

function ArchiveTechnicianWithConfirmationButton({
  technician,
}: ArchiveTechnicianWithConfirmationButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveTechnicians } = useAuthPermissions();
  const archiveMutation = useArchiveTechnicianMutation();

  if (!canArchiveTechnicians) return null;

  const handleArchiveButtonClick = () => {
    archiveMutation.reset();
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(technician.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/technicians", { replace: true });
      },
    });
  };

  return (
    <>
      <ArchiveButton
        label="Archive Technician"
        handleClick={handleArchiveButtonClick}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="technician"
        entityName={technician.alias}
        confirmationMessageSubtext=" Service zones, skills, and ignore-list items will be preserved, but the technician will be excluded from jobs matching. You can restore this technician from the archive at any time."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveTechnicianWithConfirmationButton;
