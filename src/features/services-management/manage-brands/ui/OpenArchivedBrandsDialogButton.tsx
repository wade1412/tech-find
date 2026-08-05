import { useState } from "react";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { archivedManagementItemsButtonStyle } from "../../../../shared/styles/styles";
import ManageArchivedBrandsDialog from "./ManageArchivedBrandsDialog";

function OpenArchivedBrandsDialogButton() {
  const { canArchiveServices } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canArchiveServices) return null;

  return (
    <>
      <ArchiveButton
        label="Brand Archive"
        handleClick={() => setIsOpen(true)}
        className={archivedManagementItemsButtonStyle}
      />

      <ManageArchivedBrandsDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default OpenArchivedBrandsDialogButton;
