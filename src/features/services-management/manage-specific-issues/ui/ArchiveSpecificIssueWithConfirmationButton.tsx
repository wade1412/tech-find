import { useState } from "react";
import { useNavigate } from "react-router";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { archiveEntityButtonStyle } from "../../../../shared/styles/styles";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import ConfirmArchiveEntityDialog from "../../../../shared/ui/ConfirmArchiveEntityDialog";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveSpecificIssueMutation } from "../model/useSpecificIssueArchiveMutations";

function ArchiveSpecificIssueWithConfirmationButton({
  specificIssue,
}: {
  specificIssue: SpecificIssue;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveServices } = useAuthPermissions();
  const archiveMutation = useArchiveSpecificIssueMutation();

  if (!canArchiveServices) return null;

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  return (
    <>
      <ArchiveButton
        label="Archive Specific Issue"
        handleClick={() => {
          archiveMutation.reset();
          setIsDialogOpen(true);
        }}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="specific issue"
        entityName={specificIssue.name}
        confirmationMessageSubtext="The issue and its technician configuration will be preserved, but it will be removed from active workflows. You can restore it at any time while its unit is available."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={() =>
          archiveMutation.mutate(specificIssue.id, {
            onSuccess: () => {
              setIsDialogOpen(false);
              navigate("/services?section=specific_issues", { replace: true });
            },
          })
        }
      />
    </>
  );
}

export default ArchiveSpecificIssueWithConfirmationButton;
