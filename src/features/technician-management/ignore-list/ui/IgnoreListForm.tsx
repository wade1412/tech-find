import { useEffect, useMemo, useState } from "react";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { TechnicianIgnoreList } from "../../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { formWithPaddingStyle } from "../../../../shared/styles/styles";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import {
  createIgnoreItemDraft,
  createIgnoreListPatch,
} from "../model/ignoreList.helpers";
import type { IgnoreItemDraft } from "../model/ignoreList.types";
import { useUpdateTechnicianIgnoreListMutation } from "../model/useUpdateTechnicianIgnoreListMutation";
import IgnoreListFields from "./IgnoreListFields";

interface IgnoreListFormProps {
  technicianId: string;
  technicianIgnoreList: TechnicianIgnoreList[];
  units: Unit[];
  unitsById: Map<string, Unit>;
  brands: Brand[];
  brandsById: Map<string, Brand>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
  onDirtyChange?: (isDirty: boolean) => void;
}

function IgnoreListForm({
  technicianId,
  technicianIgnoreList,
  units,
  unitsById,
  brands,
  brandsById,
  specificIssues,
  specificIssuesById,
  onDirtyChange,
}: IgnoreListFormProps) {
  const initialItems = useMemo(
    () => technicianIgnoreList.map(createIgnoreItemDraft),
    [technicianIgnoreList],
  );
  const [itemsDraft, setItemsDraft] = useState<IgnoreItemDraft[]>(initialItems);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicianIgnoreListMutation =
    useUpdateTechnicianIgnoreListMutation();

  const patch = useMemo(
    () => createIgnoreListPatch(technicianIgnoreList, itemsDraft),
    [technicianIgnoreList, itemsDraft],
  );

  const isDirty =
    patch.addedItems.length > 0 || patch.removedItemIds.length > 0;
  const isPending = updateTechnicianIgnoreListMutation.isPending;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleDiscardChanges = () => {
    setItemsDraft(initialItems);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDirty || isPending) return;

    updateTechnicianIgnoreListMutation.mutate(
      {
        technicianId,
        addedItems: patch.addedItems,
        removedItemIds: patch.removedItemIds,
      },
      {
        onSuccess: (savedItems) => {
          setItemsDraft(savedItems.map(createIgnoreItemDraft));
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={formWithPaddingStyle} onSubmit={handleSubmit} noValidate>
      <IgnoreListFields
        items={itemsDraft}
        onChange={setItemsDraft}
        units={units}
        unitsById={unitsById}
        brands={brands}
        brandsById={brandsById}
        specificIssues={specificIssues}
        specificIssuesById={specificIssuesById}
        disabled={isPending}
      />

      <FormSubmitArea
        error={updateTechnicianIgnoreListMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        onDiscard={handleDiscardChanges}
      />

      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default IgnoreListForm;
