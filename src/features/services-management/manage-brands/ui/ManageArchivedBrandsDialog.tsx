import { useMemo, useState } from "react";
import { useBrandsQuery } from "../../../../entities/brand/useBrandsQuery";
import { useBrandGroupsQuery } from "../../../../entities/brandGroup/useBrandGroupsQuery";
import ArchivedServiceEntityList from "../../archive-service-entity/ui/ArchivedServiceEntityList";
import ManageArchivedServiceEntitiesDialog from "../../archive-service-entity/ui/ManageArchivedServiceEntitiesDialog";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import {
  usePurgeBrandMutation,
  useRestoreBrandMutation,
} from "../model/useBrandArchiveMutations";
import {
  usePurgeBrandGroupMutation,
  useRestoreBrandGroupMutation,
} from "../model/useBrandGroupArchiveMutations";
import ConfirmPermanentBrandEntityPurgeDialog, {
  type BrandPurgeTarget,
} from "./ConfirmPermanentBrandEntityPurgeDialog";

interface ManageArchivedBrandsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ManageArchivedBrandsDialog({
  isOpen,
  onClose,
}: ManageArchivedBrandsDialogProps) {
  const { canPurgeServices } = useAuthPermissions();
  const [purgeTarget, setPurgeTarget] = useState<BrandPurgeTarget | null>(null);
  const archivedBrandsQuery = useBrandsQuery("archived", isOpen);
  const archivedGroupsQuery = useBrandGroupsQuery("archived", isOpen);
  const currentGroupsQuery = useBrandGroupsQuery("all", isOpen);
  const restoreBrandMutation = useRestoreBrandMutation();
  const purgeBrandMutation = usePurgeBrandMutation();
  const restoreGroupMutation = useRestoreBrandGroupMutation();
  const purgeGroupMutation = usePurgeBrandGroupMutation();
  const isMutating =
    restoreBrandMutation.isPending ||
    purgeBrandMutation.isPending ||
    restoreGroupMutation.isPending ||
    purgeGroupMutation.isPending;

  const archivedBrands = useMemo(
    () => archivedBrandsQuery.data ?? [],
    [archivedBrandsQuery.data],
  );
  const archivedGroups = useMemo(
    () => archivedGroupsQuery.data ?? [],
    [archivedGroupsQuery.data],
  );
  const archivedGroupIds = useMemo(
    () => new Set(archivedGroups.map((group) => group.id)),
    [archivedGroups],
  );
  const currentGroupsById = useMemo(
    () => new Map((currentGroupsQuery.data ?? []).map((group) => [group.id, group])),
    [currentGroupsQuery.data],
  );
  const archivedBrandsByGroupId = useMemo(() => {
    const groupedBrands = new Map<string, typeof archivedBrands>();

    archivedBrands.forEach((brand) => {
      const groupBrands = groupedBrands.get(brand.group_id) ?? [];
      groupBrands.push(brand);
      groupedBrands.set(brand.group_id, groupBrands);
    });

    return groupedBrands;
  }, [archivedBrands]);
  const independentlyArchivedBrands = useMemo(
    () =>
      archivedBrands.filter(
        (brand) =>
          brand.archived_via_group_id === null &&
          !archivedGroupIds.has(brand.group_id),
      ),
    [archivedBrands, archivedGroupIds],
  );

  const isLoading =
    archivedBrandsQuery.isPending ||
    archivedGroupsQuery.isPending ||
    currentGroupsQuery.isPending;
  const hasLoadError =
    archivedBrandsQuery.isError ||
    archivedGroupsQuery.isError ||
    currentGroupsQuery.isError;

  const resetMutations = () => {
    restoreBrandMutation.reset();
    purgeBrandMutation.reset();
    restoreGroupMutation.reset();
    purgeGroupMutation.reset();
  };

  const handleClose = () => {
    if (isMutating) return;
    resetMutations();
    setPurgeTarget(null);
    onClose();
  };

  const handlePurgeClose = () => {
    if (isMutating) return;
    purgeBrandMutation.reset();
    purgeGroupMutation.reset();
    setPurgeTarget(null);
  };

  const handlePurgeConfirm = () => {
    if (!purgeTarget) return;

    const mutation =
      purgeTarget.type === "brand-group"
        ? purgeGroupMutation
        : purgeBrandMutation;

    mutation.mutate(purgeTarget.entity.id, {
      onSuccess: () => setPurgeTarget(null),
    });
  };

  const activePurgeMutation =
    purgeTarget?.type === "brand-group"
      ? purgeGroupMutation
      : purgeBrandMutation;

  return (
    <>
      <ManageArchivedServiceEntitiesDialog
        title="Brand Archive"
        description="Restore brand groups with their group-owned brands, or restore individually archived brands. Individually archived brands remain archived when their group is restored."
        isBusy={isMutating}
        isOpen={isOpen}
        onClose={handleClose}
        status={{
          isLoading,
          errorMessage: hasLoadError
            ? "Failed to load the brand archive."
            : undefined,
        }}
      >
        <div className="flex flex-col gap-6">
          <section aria-labelledby="archived-brand-groups-heading">
            <div className="mb-2.5">
              <h3
                id="archived-brand-groups-heading"
                className="font-heading text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Brand Groups
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Restoring a group also restores brands archived through that group.
              </p>
            </div>

            <ArchivedServiceEntityList
              copy={{
                emptyDescription: "Archived brand groups will appear here.",
                entityLabel: "brand group",
                purgeDescription:
                  "Purging a group permanently removes all related brands and their technician configuration, including brands archived individually.",
              }}
              items={archivedGroups}
              onPurgeRequest={(group) =>
                setPurgeTarget({
                  childCount: archivedBrandsByGroupId.get(group.id)?.length ?? 0,
                  entity: group,
                  type: "brand-group",
                })
              }
              onRestore={(id) => {
                restoreGroupMutation.reset();
                restoreGroupMutation.mutate(id);
              }}
              renderDetails={(group) => {
                const groupBrands = archivedBrandsByGroupId.get(group.id) ?? [];
                const restoredWithGroup = groupBrands.filter(
                  (brand) => brand.archived_via_group_id === group.id,
                ).length;
                const individuallyArchived = groupBrands.length - restoredWithGroup;

                return (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {group.slug} · {restoredWithGroup}{" "}
                    {restoredWithGroup === 1 ? "brand restores" : "brands restore"}
                    {individuallyArchived > 0
                      ? ` · ${individuallyArchived} stays archived`
                      : ""}
                  </p>
                );
              }}
              state={{
                canPurge: canPurgeServices,
                isBusy: isMutating,
                restoreError: restoreGroupMutation.isError,
                restoringId: restoreGroupMutation.isPending
                  ? restoreGroupMutation.variables
                  : undefined,
              }}
            />
          </section>

          <section aria-labelledby="archived-individual-brands-heading">
            <div className="mb-2.5 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <h3
                id="archived-individual-brands-heading"
                className="font-heading text-sm font-semibold text-zinc-800 dark:text-zinc-100"
              >
                Individual Brands
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Brands archived separately from their active group.
              </p>
            </div>

            <ArchivedServiceEntityList
              copy={{
                emptyDescription: "Individually archived brands will appear here.",
                entityLabel: "brand",
                purgeDescription:
                  "Purging a brand permanently removes it and its technician ignore-list references.",
              }}
              items={independentlyArchivedBrands}
              onPurgeRequest={(brand) =>
                setPurgeTarget({ entity: brand, type: "brand" })
              }
              onRestore={(id) => {
                restoreBrandMutation.reset();
                restoreBrandMutation.mutate(id);
              }}
              renderDetails={(brand) => (
                <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {brand.slug} ·{" "}
                  {currentGroupsById.get(brand.group_id)?.name ?? "Unknown group"}
                </p>
              )}
              state={{
                canPurge: canPurgeServices,
                isBusy: isMutating,
                restoreError: restoreBrandMutation.isError,
                restoringId: restoreBrandMutation.isPending
                  ? restoreBrandMutation.variables
                  : undefined,
              }}
            />
          </section>
        </div>
      </ManageArchivedServiceEntitiesDialog>

      <ConfirmPermanentBrandEntityPurgeDialog
        key={purgeTarget ? `${purgeTarget.type}-${purgeTarget.entity.id}` : "closed"}
        target={purgeTarget}
        isPending={activePurgeMutation.isPending}
        error={activePurgeMutation.error}
        onClose={handlePurgeClose}
        onConfirm={handlePurgeConfirm}
      />
    </>
  );
}

export default ManageArchivedBrandsDialog;
