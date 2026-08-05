import { useState } from "react";
import {
  archivedManagementItemsButtonStyle,
} from "../../../../../shared/styles/styles";
import ArchiveButton from "../../../../../shared/ui/ArchiveButton";
import { useAuthPermissions } from "../../../../auth/model/useAuthPermissions";
import ManageArchivedUnitsDialog from "./ManageArchivedUnitsDialog";

function OpenArchivedUnitsDialogButton() {
  const { canArchiveServices } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canArchiveServices) return null;

  return (
    <>
      <ArchiveButton
        label="Archived Units"
        handleClick={() => setIsOpen(true)}
        className={archivedManagementItemsButtonStyle}
      />

      <ManageArchivedUnitsDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default OpenArchivedUnitsDialogButton;
