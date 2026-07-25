import { useState } from "react";
import { archivedManagementItemsButtonStyle } from "../../../../shared/styles/styles";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import ManageArchivedUsersDialog from "./ManageArchivedUsersDialog";

function OpenArchivedUsersDialogButton() {
  const { canManageUsers } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canManageUsers) return null;

  return (
    <>
      <ArchiveButton
        label="Archived Users"
        handleClick={() => setIsOpen(true)}
        className={archivedManagementItemsButtonStyle}
      />

      <ManageArchivedUsersDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default OpenArchivedUsersDialogButton;
