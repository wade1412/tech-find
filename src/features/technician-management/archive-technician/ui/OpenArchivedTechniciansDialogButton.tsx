import { useState } from "react";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import ManageArchivedTechniciansDialog from "./ManageArchivedTechniciansDialog";
import { archivedManagementItemsButtonStyle } from "../../../../shared/styles/styles";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";

function OpenArchivedTechniciansDialogButton() {
  const { canArchiveTechnicians } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canArchiveTechnicians) return null;

  return (
    <>
      <ArchiveButton
        label="Archived Technicians"
        handleClick={() => setIsOpen(true)}
        className={archivedManagementItemsButtonStyle}
      />

      <ManageArchivedTechniciansDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default OpenArchivedTechniciansDialogButton;
