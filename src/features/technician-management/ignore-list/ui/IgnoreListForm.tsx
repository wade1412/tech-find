import { useMemo, useState } from "react";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { TechnicianIgnoreList } from "../../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { formStyle, noEditValuesStyle } from "../../../../shared/styles/styles";
import SectionHeader from "../../ui/SectionHeader";
import SubmitSnackbar from "../../ui/SubmitSnackbar";
import IgnoreListItemCard from "./IgnoreListItemCard";
import { AnimatePresence, motion } from "motion/react";
import { fadePresenceMotionProps } from "../../../../shared/styles/motionVariants";
import IgnoreItemEditor from "./IgnoreItemEditor";
import SubmitArea from "../../ui/SubmitArea";
import { useUpdateTechnicianIgnoreListMutation } from "../model/useUpdateTechnicianIgnoreListMutation";
import {
  createIgnoreItemDraft,
  createIgnoreListPatch,
  getIgnoreItemIdentity,
  isDuplicateIgnoreItem,
  isEmptyIgnoreItem,
} from "../model/ignoreList.helpers";
import type { IgnoreItemDraft } from "../model/ignoreList.types";

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

type IgnoreListEditorState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; item: IgnoreItemDraft };

function IgnoreListForm({
  technicianId,
  technicianIgnoreList,
  units,
  unitsById,
  brands,
  brandsById,
  specificIssues,
  specificIssuesById,
}: IgnoreListFormProps) {
  const initialIgnoreListDraft: IgnoreItemDraft[] = technicianIgnoreList.map(
    (item) => createIgnoreItemDraft(item),
  );

  const [ignoreListDraft, setIgnoreListDraft] = useState(
    initialIgnoreListDraft,
  );
  const [editor, setEditor] = useState<IgnoreListEditorState>({
    mode: "closed",
  });
  const [editorError, setEditorError] = useState<string | null>(null);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicianIgnoreListMutation =
    useUpdateTechnicianIgnoreListMutation();

  //Editor handlers
  const toggleOpenEditIgnoreItem = () => {
    setEditorError(null);

    setEditor((prev) =>
      prev.mode === "closed" ? { mode: "add" } : { mode: "closed" },
    );
  };
  const handleOpenEditIgnoreItem = (ignoreItem: IgnoreItemDraft) => {
    setEditorError(null);
    setEditor({ mode: "edit", item: ignoreItem });
  };
  const isEditorOpen = editor.mode !== "closed";
  const selectedIgnoreItem = editor.mode === "edit" ? editor.item : undefined;

  const handleRemoveIgnoreItem = (key: string) => {
    setIgnoreListDraft((prev) => prev.filter((i) => i.key !== key));
  };

  // patch and submit logic
  const patch = useMemo(
    () => createIgnoreListPatch(technicianIgnoreList, ignoreListDraft),
    [technicianIgnoreList, ignoreListDraft],
  );

  const isDirty =
    patch.addedItems.length > 0 || patch.removedItemsIds.length > 0;
  const isPending = updateTechnicianIgnoreListMutation.isPending;

  const handleDiscardChanges = () => {
    setEditorError(null);
    setIgnoreListDraft(initialIgnoreListDraft);
  };

  // Submit handler
  const handleSubmitIgnoreItem = (next: IgnoreItemDraft) => {
    // return early on unchanged skill
    const isIgnoreItemUnchanged =
      editor.mode === "edit" &&
      getIgnoreItemIdentity(editor.item) === getIgnoreItemIdentity(next);

    if (isIgnoreItemUnchanged) {
      setEditor({ mode: "closed" });
      return;
    }

    if (isEmptyIgnoreItem(next)) {
      setEditorError(
        "Ignore item cannot be empty, please make sure to fill at least one field",
      );
      return;
    }

    if (isDuplicateIgnoreItem(next, ignoreListDraft)) {
      setEditorError(
        "Technician already has a an ignore item of this type, please add a unique item",
      );
      return;
    }

    setIgnoreListDraft((prev) =>
      editor.mode === "edit"
        ? prev.map((item) =>
            item.key === editor.item.key
              ? { ...next, key: item.key, sourceId: null }
              : item,
          )
        : [...prev, next],
    );

    setEditor({ mode: "closed" });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDirty || isPending) return;

    // updateTechnicianIgnoreListMutation.mutate(
    //   {
    //     technicianId,
    //     ...patch,
    //   },
    //   {
    //     onSuccess: (savedIgnoreItems) => {
    //       setIgnoreListDraft(createIgnoreItemDraft(savedIgnoreItems));
    //       setDuplicateError(null);
    //       setIsSavedSnackbarOpen(true);
    //     },
    //   },
    // );
  };

  return (
    <form className={`${formStyle} p-2`}>
      {/* Header Section - Add Technician Ignore Item and Title */}
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader
            label="Edit Ignore List"
            subtext="Edit technician ignore list"
          />

          <button
            type="button"
            disabled={false}
            onClick={toggleOpenEditIgnoreItem}
            className={[
              "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-[background-color,border-color,color,opacity,transform]",
              "focus-visible:ring-main-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
              "disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950",
              isEditorOpen
                ? "border-main-500/50 bg-main-500/10 text-main-500 hover:border-main-500/70 hover:bg-main-500/15 dark:border-main-400/40 dark:bg-main-400/10 dark:text-main-400 dark:hover:border-main-400/60 dark:hover:bg-main-400/15"
                : "hover:text-main-500 dark:hover:text-main-400 border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            <svg
              className={[
                "h-3.5 w-3.5 transition-transform",
                isEditorOpen ? "rotate-45" : "",
              ].join(" ")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>

            <span className="min-w-[7ch] text-center">
              {isEditorOpen ? "Close" : "Add Ignore Item"}
            </span>
          </button>
        </div>

        <AnimatePresence>
          {editor.mode !== "closed" && (
            <motion.div
              key="ignore-item-editor"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="pt-4">
                <IgnoreItemEditor
                  key={selectedIgnoreItem?.key ?? "new"}
                  selectedIgnoreItem={selectedIgnoreItem}
                  isDisabled={isPending}
                  units={units}
                  unitsById={unitsById}
                  brands={brands}
                  specificIssues={specificIssues}
                  error={editorError}
                  resetError={() => setEditorError(null)}
                  handleSubmitIgnoreItem={handleSubmitIgnoreItem}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
      />

      <AnimatePresence initial={false} mode="wait">
        {ignoreListDraft.length > 0 ? (
          <motion.div
            key="ignore-items-container"
            className="grid grid-cols-2 gap-4"
            {...fadePresenceMotionProps}
          >
            {ignoreListDraft.map((ignoreItem) => {
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
                  key={ignoreItem.key}
                  isDisabled={isPending}
                  unitName={unitName}
                  brandName={brandName}
                  issueName={issueName}
                  onEdit={() => handleOpenEditIgnoreItem(ignoreItem)}
                  onRemove={() => handleRemoveIgnoreItem(ignoreItem.key)}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="ignore-items-empty"
            className={`${noEditValuesStyle} col-span-2`}
            {...fadePresenceMotionProps}
          >
            No ignore itmes for this technician. Use "Add Ignore Item" to add
            one.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Area */}
      <SubmitArea
        error={updateTechnicianIgnoreListMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        handleDiscardChanges={handleDiscardChanges}
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
