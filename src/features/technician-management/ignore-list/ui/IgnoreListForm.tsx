import { useState } from "react";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { TechnicianIgnoreList } from "../../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { formStyle } from "../../../../shared/styles/styles";
import SectionHeader from "../../ui/SectionHeader";
import SubmitArea from "../../ui/SubmitArea";
import SubmitSnackbar from "../../ui/SubmitSnackbar";
import IgnoreListItemCard from "./IgnoreListItemCard";

interface IgnoreListFormProps {
  technicianId: string;
  technicianIgnoreList: TechnicianIgnoreList[];
  units: Unit[];
  unitsById: Map<string, Unit>;
  brands: Brand[];
  brandsById: Map<string, Brand>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
}

function IgnoreListForm({
  technicianId,
  technicianIgnoreList,
  units,
  unitsById,
  brands,
  brandsById,
  specificIssue,
  specificIssuesById,
}: IgnoreListFormProps) {
  const [ignoreListDraft, setIgnoreListDraft] = useState(technicianIgnoreList);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const handleRemoveIgnoreItem = (id: string) => {
    setIgnoreListDraft((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <form className={`${formStyle} p-2`}>
      <SectionHeader
        label="Edit Ignore List"
        subtext="Edit technician ignore list"
      />

      {/* Divider */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
      />

      <div>
        {ignoreListDraft.length > 0 ? (
          ignoreListDraft.map((ignoreItem) => {
            const unitName = ignoreItem.unit_id
              ? (unitsById.get(ignoreItem.unit_id)?.name ?? null)
              : null;

            const brandName = ignoreItem.brand_id
              ? (brandsById.get(ignoreItem.brand_id)?.name ?? null)
              : null;

            const issueName = ignoreItem.specific_issue_id
              ? (specificIssuesById.get(ignoreItem.specific_issue_id)?.name ??
                null)
              : null;

            return (
              <IgnoreListItemCard
                key={ignoreItem.id}
                unitName={unitName}
                brandName={brandName}
                issueName={issueName}
                onRemove={() => handleRemoveIgnoreItem(ignoreItem.id)}
              />
            );
          })
        ) : (
          <div>No ignores</div>
        )}
      </div>

      {/* Submit Area */}
      <SubmitArea
        error={null}
        isDirty={false}
        isPending={false}
        handleDiscardChanges={() => {}}
      />

      {/* Success Snackbar */}
      <SubmitSnackbar
        isOpen={isSavedSnackbarOpen}
        handleClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default IgnoreListForm;
