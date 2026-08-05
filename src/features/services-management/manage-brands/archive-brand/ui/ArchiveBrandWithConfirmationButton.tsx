import { useState } from "react";
import { useNavigate } from "react-router";
import type { Brand } from "../../../../../entities/brand/brand.types";
import { archiveEntityButtonStyle } from "../../../../../shared/styles/styles";
import ArchiveButton from "../../../../../shared/ui/ArchiveButton";
import ConfirmArchiveEntityDialog from "../../../../../shared/ui/ConfirmArchiveEntityDialog";
import { useAuthPermissions } from "../../../../auth/model/useAuthPermissions";
import { useArchiveBrandMutation } from "../../model/useBrandArchiveMutations";

function ArchiveBrandWithConfirmationButton({ brand }: { brand: Brand }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveServices } = useAuthPermissions();
  const archiveMutation = useArchiveBrandMutation();

  if (!canArchiveServices) return null;

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(brand.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/services", { replace: true });
      },
    });
  };

  return (
    <>
      <ArchiveButton
        label="Archive Brand"
        handleClick={() => {
          archiveMutation.reset();
          setIsDialogOpen(true);
        }}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="brand"
        entityName={brand.name}
        confirmationMessageSubtext="The brand and its related configuration will be preserved, but it will be removed from service filters and management lists. You can restore it at any time."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveBrandWithConfirmationButton;
