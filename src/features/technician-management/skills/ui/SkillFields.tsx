import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  fadePresenceMotionProps,
  listItemPresenceMotionProps,
  softLayoutTransition,
} from "../../../../shared/styles/motionVariants";
import { noEditValuesStyle } from "../../../../shared/styles/styles";
import OpenEditorButton from "../../ui/Editor/OpenEditorButton";
import SectionHeader from "../../ui/SectionHeader";
import {
  filterSkillsBySearch,
  getSkillIdentity,
} from "../model/skills.helpers";
import type { SkillDraft } from "../model/skills.types";
import SkillEditor from "./SkillEditor";
import SkillGroup from "./SkillGroup";
import SkillTemplates, { type SkillTemplateFeedback } from "./SkillTemplates";
import type {
  SkillTemplateAvailability,
  SkillTemplateDefinition,
} from "../model/skillTemplates.types";
import {
  applySkillTemplate,
  getSkillTemplateAvailability,
} from "../model/skillTemplates.helpers";
import ClearSkillsDialog from "./ClearSkillsDialog";
import SearchInput from "../../../../shared/ui/SearchInput";

interface SkillFieldsProps {
  skills: SkillDraft[];
  onChange: (skills: SkillDraft[]) => void;
  units: Unit[];
  unitsById: Map<string, Unit>;
  brandGroups: BrandGroup[];
  brandGroupById: Map<string, BrandGroup>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
  disabled: boolean;
  templates?: readonly SkillTemplateDefinition[];
  allowClearAll?: boolean;
}

type SkillEditorState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; skill: SkillDraft };

function SkillFields({
  skills,
  onChange,
  units,
  unitsById,
  brandGroups,
  brandGroupById,
  specificIssues,
  specificIssuesById,
  disabled,
  templates = [],
  allowClearAll = false,
}: SkillFieldsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editor, setEditor] = useState<SkillEditorState>({ mode: "closed" });
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [templateFeedback, setTemplateFeedback] =
    useState<SkillTemplateFeedback | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const visibleSkills = useMemo(
    () =>
      filterSkillsBySearch(
        skills,
        searchTerm,
        unitsById,
        brandGroupById,
        specificIssuesById,
      ),
    [skills, searchTerm, unitsById, brandGroupById, specificIssuesById],
  );

  //Maps
  const skillsByUnitId = useMemo(() => {
    const map = new Map<string, SkillDraft[]>();

    visibleSkills.forEach((skill) => {
      const unitSkills = map.get(skill.unitId) ?? [];
      unitSkills.push(skill);
      map.set(skill.unitId, unitSkills);
    });

    return map;
  }, [visibleSkills]);

  const templateAvailabilityById = useMemo(
    () =>
      new Map<SkillTemplateDefinition["id"], SkillTemplateAvailability>(
        templates.map((template) => [
          template.id,
          getSkillTemplateAvailability(skills, units, brandGroups, template),
        ]),
      ),
    [brandGroups, skills, templates, units],
  );

  const toggleEditor = () => {
    setDuplicateError(null);
    setEditor((current) =>
      current.mode === "closed" ? { mode: "add" } : { mode: "closed" },
    );
  };

  const openEditSkill = (skill: SkillDraft) => {
    setDuplicateError(null);
    setEditor({ mode: "edit", skill });
  };

  const removeSkill = (key: string) => {
    const nextSkills = skills.filter((skill) => skill.key !== key);

    onChange(nextSkills);
    setTemplateFeedback(null);

    if (nextSkills.length === 0) {
      setSearchTerm("");
    }

    if (editor.mode === "edit" && editor.skill.key === key) {
      setEditor({ mode: "closed" });
      setDuplicateError(null);
    }
  };

  const handleApplyTemplate = (template: SkillTemplateDefinition) => {
    const result = applySkillTemplate(skills, units, brandGroups, template);

    if (!result.success) {
      setTemplateFeedback({ tone: "error", message: result.error });
      return;
    }

    onChange(result.skills);

    if (result.addedCount === 0) {
      setTemplateFeedback({
        tone: "info",
        message: `All skills from ${template.label} are already added.`,
      });
      return;
    }

    const skippedMessage =
      result.skippedCount > 0
        ? ` Skipped ${result.skippedCount} existing ${result.skippedCount === 1 ? "skill" : "skills"}.`
        : "";

    setTemplateFeedback({
      tone: "success",
      message: `Added ${result.addedCount} ${result.addedCount === 1 ? "skill" : "skills"}.${skippedMessage}`,
    });
  };

  const handleClearAllSkills = () => {
    onChange([]);
    setEditor({ mode: "closed" });
    setDuplicateError(null);
    setTemplateFeedback(null);
    setSearchTerm("");
    setIsClearDialogOpen(false);
  };

  const submitSkill = (next: SkillDraft) => {
    if (
      editor.mode === "edit" &&
      getSkillIdentity(editor.skill) === getSkillIdentity(next)
    ) {
      setEditor({ mode: "closed" });
      return;
    }

    const isDuplicate = skills.some(
      (skill) =>
        skill.key !== next.key &&
        getSkillIdentity(skill) === getSkillIdentity(next),
    );

    if (isDuplicate) {
      setDuplicateError(
        "Technician already has a skill of this type, please add a unique skill",
      );
      return;
    }

    const nextSkills =
      editor.mode === "edit"
        ? skills.map((skill) =>
            skill.key === editor.skill.key
              ? { ...next, key: skill.key, sourceId: null }
              : skill,
          )
        : [...skills, next];

    onChange(nextSkills);
    setDuplicateError(null);
    setTemplateFeedback(null);
    setEditor({ mode: "closed" });
  };

  const isEditorOpen = editor.mode !== "closed";
  const selectedSkill = editor.mode === "edit" ? editor.skill : undefined;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader label="Skills" subtext="Add or remove skills" />

          <div className="flex flex-wrap items-center justify-end gap-2">
            {allowClearAll && (
              <button
                type="button"
                disabled={disabled || skills.length === 0}
                onClick={() => setIsClearDialogOpen(true)}
                className="focus-visible:ring-main-500 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-500 transition-[background-color,color,opacity] enabled:hover:bg-zinc-100 enabled:hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800/70 dark:enabled:hover:text-red-400 dark:focus-visible:ring-offset-zinc-950"
              >
                Clear all ({skills.length})
              </button>
            )}

            <OpenEditorButton
              isDisabled={disabled}
              isEditorOpen={isEditorOpen}
              toggleOpen={toggleEditor}
              label={isEditorOpen ? "Close" : "Add Skill"}
            />
          </div>
        </div>

        <AnimatePresence>
          {isEditorOpen && (
            <motion.div
              key="skill-editor"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="pt-4">
                <SkillEditor
                  key={selectedSkill?.key ?? "new"}
                  selectedSkillDraft={selectedSkill}
                  isDisabled={disabled}
                  units={units}
                  unitsById={unitsById}
                  brandGroups={brandGroups}
                  specificIssues={specificIssues}
                  handleSubmitSkill={submitSkill}
                  duplicateError={duplicateError}
                  resetDuplicateError={() => setDuplicateError(null)}
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

      {templates.length > 0 && (
        <>
          <SkillTemplates
            templates={templates}
            onApply={handleApplyTemplate}
            disabled={disabled}
            availabilityById={templateAvailabilityById}
            feedback={templateFeedback}
          />
          <div
            aria-hidden="true"
            className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
          />
        </>
      )}

      {/* Search and Skills List */}
      <SearchInput
        placeholder="Search skills..."
        ariaLabel="Search skills"
        className="w-full sm:w-72 sm:self-end"
        value={searchTerm}
        onValueChange={setSearchTerm}
        disabled={disabled || skills.length === 0}
      />

      <motion.div
        layout
        className="grid grid-cols-1 items-start gap-3 md:grid-cols-2"
        transition={softLayoutTransition}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visibleSkills.length > 0 ? (
            Array.from(skillsByUnitId.entries()).map(
              ([unitId, unitSkills]) => (
                <motion.div
                  layout="position"
                  key={unitId}
                  {...listItemPresenceMotionProps}
                >
                  <SkillGroup
                    isDisabled={disabled}
                    unitName={unitsById.get(unitId)?.name}
                    skillDraftsForUnit={unitSkills}
                    brandGroupById={brandGroupById}
                    specificIssuesById={specificIssuesById}
                    onEditSkill={openEditSkill}
                    onRemoveSkill={removeSkill}
                  />
                </motion.div>
              ),
            )
          ) : (
            <motion.div
              key="skills-empty"
              className={noEditValuesStyle}
              {...fadePresenceMotionProps}
            >
              {searchTerm.trim().length > 0
                ? `No skills match your search.`
                : `No skills for this technician. Use "Add Skill" to add one.`}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {allowClearAll && (
        <ClearSkillsDialog
          isOpen={isClearDialogOpen}
          skillsCount={skills.length}
          onClose={() => setIsClearDialogOpen(false)}
          onConfirm={handleClearAllSkills}
        />
      )}
    </>
  );
}

export default SkillFields;
