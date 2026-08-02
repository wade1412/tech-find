import { useState } from "react";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { useSpecificIssuesQuery } from "../../../../entities/specific-issue/useSpecificIssuesQuery";
import type { Unit } from "../../../../entities/unit/unit.types";
import ArchivedServiceEntityList from "../../archive-service-entity/ui/ArchivedServiceEntityList";
import ManageArchivedServiceEntitiesDialog from "../../archive-service-entity/ui/ManageArchivedServiceEntitiesDialog";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import {
  usePurgeSpecificIssueMutation,
  useRestoreSpecificIssueMutation,
} from "../model/useSpecificIssueArchiveMutations";
import ConfirmPermanentSpecificIssuePurgeDialog from "./ConfirmPermanentSpecificIssuePurgeDialog";

interface ManageArchivedSpecificIssuesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unitsById: ReadonlyMap<string, Unit>;
}

function ManageArchivedSpecificIssuesDialog({
  isOpen,
  onClose,
  unitsById,
}: ManageArchivedSpecificIssuesDialogProps) {
  const { canPurgeServices } = useAuthPermissions();
  const [purgeTarget, setPurgeTarget] = useState<SpecificIssue | null>(null);
  const archivedQuery = useSpecificIssuesQuery("archived", isOpen);
  const restoreMutation = useRestoreSpecificIssueMutation();
  const purgeMutation = usePurgeSpecificIssueMutation();
  const isMutating = restoreMutation.isPending || purgeMutation.isPending;

  const handleClose = () => {
    if (isMutating) return;
    restoreMutation.reset();
    purgeMutation.reset();
    setPurgeTarget(null);
    onClose();
  };

  return (
    <>
      <ManageArchivedServiceEntitiesDialog
        title="Archived Specific Issues"
        description="Restore issues without losing their unit relationship or technician configuration. Issues whose parent unit is archived become available after the unit is restored."
        isBusy={isMutating}
        isOpen={isOpen}
        onClose={handleClose}
        status={{
          isLoading: archivedQuery.isPending,
          errorMessage: archivedQuery.isError
            ? "Failed to load archived specific issues."
            : undefined,
        }}
      >
        <ArchivedServiceEntityList
          copy={{
            emptyDescription: "Archived specific issues will appear here.",
            entityLabel: "specific issue",
            purgeDescription:
              "Owner-only permanent purge removes the issue and cascades to technician skills and ignore-list references. It cannot be undone.",
          }}
          items={archivedQuery.data ?? []}
          onPurgeRequest={setPurgeTarget}
          onRestore={(id) => {
            restoreMutation.reset();
            restoreMutation.mutate(id);
          }}
          renderDetails={(specificIssue) => (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {specificIssue.slug} ·{" "}
              {unitsById.get(specificIssue.unit_id)?.name ?? "Unknown unit"}
            </p>
          )}
          state={{
            canPurge: canPurgeServices,
            isBusy: isMutating,
            restoreError: restoreMutation.isError,
            restoringId: restoreMutation.isPending
              ? restoreMutation.variables
              : undefined,
          }}
        />
      </ManageArchivedServiceEntitiesDialog>

      <ConfirmPermanentSpecificIssuePurgeDialog
        key={purgeTarget?.id ?? "closed"}
        specificIssue={purgeTarget}
        isPending={purgeMutation.isPending}
        error={purgeMutation.error}
        onClose={() => {
          if (purgeMutation.isPending) return;
          purgeMutation.reset();
          setPurgeTarget(null);
        }}
        onConfirm={() => {
          if (!purgeTarget) return;
          purgeMutation.mutate(purgeTarget.id, {
            onSuccess: () => setPurgeTarget(null),
          });
        }}
      />
    </>
  );
}

export default ManageArchivedSpecificIssuesDialog;
