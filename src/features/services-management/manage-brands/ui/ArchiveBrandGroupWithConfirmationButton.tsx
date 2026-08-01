import { useState } from "react";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { useNavigate } from "react-router";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveBrandGroupMutation } from "../model/useBrandGroupArchiveMutations";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { archiveEntityButtonStyle } from "../../../../shared/styles/styles";
import ConfirmArchiveEntityDialog from "../../../../shared/ui/ConfirmArchiveEntityDialog";

interface ArchiveBrandGroupWithConfirmationButtonProps {
  brandGroup: BrandGroup;
}

function ArchiveBrandGroupWithConfirmationButton({
  brandGroup,
}: ArchiveBrandGroupWithConfirmationButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveServices } = useAuthPermissions();
  const archiveMutation = useArchiveBrandGroupMutation();

  if (!canArchiveServices) return null;

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(brandGroup.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/services", { replace: true });
      },
    });
  };

  return (
    <>
      <ArchiveButton
        label="Archive Brand Group"
        handleClick={() => {
          archiveMutation.reset();
          setIsDialogOpen(true);
        }}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="brand group"
        entityName={brandGroup.name}
        confirmationMessageSubtext="The group and all currently available brands in it will be archived together and removed from service filters. Restoring the group later restores only brands archived through this action; brands archived individually stay archived."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveBrandGroupWithConfirmationButton;
