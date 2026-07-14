import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { fadePresenceMotionProps } from "../../../../shared/styles/motionVariants";
import { noEditValuesStyle } from "../../../../shared/styles/styles";
import OpenEditorButton from "../../ui/Editor/OpenEditorButton";
import SectionHeader from "../../ui/SectionHeader";
import { getSkillIdentity } from "../model/skills.helpers";
import type { SkillDraft } from "../model/skills.types";
import SkillEditor from "./SkillEditor";
import SkillGroup from "./SkillGroup";
import SkillTemplates, {
  type SkillTemplateFeedback,
} from "./SkillTemplates";
import type {
  SkillTemplateAvailability,
  SkillTemplateDefinition,
} from "../model/skillTemplates.types";
import {
  applySkillTemplate,
  getSkillTemplateAvailability,
} from "../model/skillTemplates.helpers";
import ClearSkillsDialog from "./ClearSkillsDialog";

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
  const [editor, setEditor] = useState<SkillEditorState>({ mode: "closed" });
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [templateFeedback, setTemplateFeedback] =
    useState<SkillTemplateFeedback | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const skillsByUnitId = useMemo(() => {
    const map = new Map<string, SkillDraft[]>();

    skills.forEach((skill) => {
      const unitSkills = map.get(skill.unitId) ?? [];
      unitSkills.push(skill);
      map.set(skill.unitId, unitSkills);
    });

    return map;
  }, [skills]);

  const templateAvailabilityById = useMemo(
    () =>
      new Map<SkillTemplateDefinition["id"], SkillTemplateAvailability>(
        templates.map((template) => [
          template.id,
          getSkillTemplateAvailability(
            skills,
            units,
            brandGroups,
            template,
          ),
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
    onChange(skills.filter((skill) => skill.key !== key));
    setTemplateFeedback(null);

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
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader label="Skills" subtext="Add or remove skills" />

          <div className="flex flex-wrap items-center justify-end gap-2">
            {allowClearAll && (
              <button
                type="button"
                disabled={disabled || skills.length === 0}
                onClick={() => setIsClearDialogOpen(true)}
                className="inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
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

      <AnimatePresence initial={false} mode="wait">
        {skills.length > 0 ? (
          <motion.div
            key="skills-container"
            className="columns-1 gap-3 md:columns-2"
            {...fadePresenceMotionProps}
          >
            {Array.from(skillsByUnitId.entries()).map(
              ([unitId, unitSkills]) => (
                <SkillGroup
                  key={unitId}
                  isDisabled={disabled}
                  unitName={unitsById.get(unitId)?.name}
                  skillDraftsForUnit={unitSkills}
                  brandGroupById={brandGroupById}
                  specificIssuesById={specificIssuesById}
                  onEditSkill={openEditSkill}
                  onRemoveSkill={removeSkill}
                />
              ),
            )}
          </motion.div>
        ) : (
          <motion.div
            key="skills-empty"
            className={noEditValuesStyle}
            {...fadePresenceMotionProps}
          >
            No skills for this technician. Use "Add Skill" to add one.
          </motion.div>
        )}
      </AnimatePresence>

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
