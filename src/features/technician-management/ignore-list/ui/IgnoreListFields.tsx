import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { fadePresenceMotionProps } from "../../../../shared/styles/motionVariants";
import { noEditValuesStyle } from "../../../../shared/styles/styles";
import OpenEditorButton from "../../ui/Editor/OpenEditorButton";
import SectionHeader from "../../ui/SectionHeader";
import {
  getIgnoreItemIdentity,
  isDuplicateIgnoreItem,
  isEmptyIgnoreItem,
} from "../model/ignoreList.helpers";
import type { IgnoreItemDraft } from "../model/ignoreList.types";
import IgnoreItemEditor from "./IgnoreItemEditor";
import IgnoreListItemCard from "./IgnoreListItemCard";

interface IgnoreListFieldsProps {
  items: IgnoreItemDraft[];
  onChange: (items: IgnoreItemDraft[]) => void;
  units: Unit[];
  unitsById: Map<string, Unit>;
  brands: Brand[];
  brandsById: Map<string, Brand>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
  disabled: boolean;
}

type IgnoreListEditorState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; item: IgnoreItemDraft };

function IgnoreListFields({
  items,
  onChange,
  units,
  unitsById,
  brands,
  brandsById,
  specificIssues,
  specificIssuesById,
  disabled,
}: IgnoreListFieldsProps) {
  const [editor, setEditor] = useState<IgnoreListEditorState>({
    mode: "closed",
  });
  const [editorError, setEditorError] = useState<string | null>(null);

  const toggleEditor = () => {
    setEditorError(null);
    setEditor((current) =>
      current.mode === "closed" ? { mode: "add" } : { mode: "closed" },
    );
  };

  const openEditItem = (item: IgnoreItemDraft) => {
    setEditorError(null);
    setEditor({ mode: "edit", item });
  };

  const removeItem = (key: string) => {
    onChange(items.filter((item) => item.key !== key));

    if (editor.mode === "edit" && editor.item.key === key) {
      setEditor({ mode: "closed" });
      setEditorError(null);
    }
  };

  const submitItem = (next: IgnoreItemDraft) => {
    if (
      editor.mode === "edit" &&
      getIgnoreItemIdentity(editor.item) === getIgnoreItemIdentity(next)
    ) {
      setEditor({ mode: "closed" });
      return;
    }

    if (isEmptyIgnoreItem(next)) {
      setEditorError(
        "Ignore item cannot be empty, please make sure to fill at least one field",
      );
      return;
    }

    if (isDuplicateIgnoreItem(next, items)) {
      setEditorError(
        "Technician already has an ignore item of this type, please add a unique item",
      );
      return;
    }

    const nextItems =
      editor.mode === "edit"
        ? items.map((item) =>
            item.key === editor.item.key
              ? { ...next, key: item.key, sourceId: null }
              : item,
          )
        : [...items, next];

    onChange(nextItems);
    setEditorError(null);
    setEditor({ mode: "closed" });
  };

  const isEditorOpen = editor.mode !== "closed";
  const selectedItem = editor.mode === "edit" ? editor.item : undefined;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader
            label="Edit Ignore List"
            subtext="Edit technician ignore list"
          />

          <OpenEditorButton
            label={isEditorOpen ? "Close" : "Add Ignore Item"}
            isDisabled={disabled}
            toggleOpen={toggleEditor}
            isEditorOpen={isEditorOpen}
          />
        </div>

        <AnimatePresence>
          {isEditorOpen && (
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
                  key={selectedItem?.key ?? "new"}
                  selectedIgnoreItem={selectedItem}
                  isDisabled={disabled}
                  units={units}
                  brands={brands}
                  specificIssues={specificIssues}
                  editorError={editorError}
                  resetEditorError={() => setEditorError(null)}
                  handleSubmitIgnoreItem={submitItem}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        aria-hidden="true"
        className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
      />

      <AnimatePresence initial={false} mode="wait">
        {items.length > 0 ? (
          <motion.div
            key="ignore-items-container"
            className="grid grid-cols-1 gap-3 lg:grid-cols-2"
            {...fadePresenceMotionProps}
          >
            {items.map((item) => (
              <IgnoreListItemCard
                key={item.key}
                isDisabled={disabled}
                unitName={
                  item.unit_id
                    ? (unitsById.get(item.unit_id)?.name ?? null)
                    : null
                }
                brandName={
                  item.brand_id
                    ? (brandsById.get(item.brand_id)?.name ?? null)
                    : null
                }
                issueName={
                  item.specific_issue_id
                    ? (specificIssuesById.get(item.specific_issue_id)?.name ??
                      null)
                    : null
                }
                onEdit={() => openEditItem(item)}
                onRemove={() => removeItem(item.key)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="ignore-items-empty"
            className={`${noEditValuesStyle} col-span-2`}
            {...fadePresenceMotionProps}
          >
            No ignore items for this technician. Use "Add Ignore Item" to add
            one.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default IgnoreListFields;
