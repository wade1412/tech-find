import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { useMemo, useState } from "react";
import SectionHeader from "../../ui/SectionHeader";
import { formStyle, noEditValuesStyle } from "../../../../shared/styles/styles";
import type { SkillDraft } from "../model/skills.types";
import {
  createSkillsDraft,
  createSkillsPatch,
  getSkillIdentity,
} from "../model/skills.helpers";
import SkillGroup from "./SkillGroup";
import SubmitSnackbar from "../../ui/SubmitSnackbar";
import SubmitArea from "../../ui/SubmitArea";
import { useUpdateTechnicianSkillsMutation } from "../model/useUpdateTechnicianSkillsMutation";
import SkillEditor from "./SkillEditor";
import { AnimatePresence, motion } from "motion/react";
import { fadePresenceMotionProps } from "../../../../shared/styles/motionVariants";

interface SkillsFormProps {
  technicianId: string;
  technicianSkills: TechnicianSkill[];
  units: Unit[];
  unitsById: Map<string, Unit>;
  brandGroups: BrandGroup[];
  brandGroupById: Map<string, BrandGroup>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
}

type SkillEditorState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; skill: SkillDraft };

function SkillsForm({
  technicianId,
  technicianSkills,
  units,
  unitsById,
  brandGroups,
  brandGroupById,
  specificIssues,
  specificIssuesById,
}: SkillsFormProps) {
  const initialSkillsDraft: SkillDraft[] = createSkillsDraft(technicianSkills);

  const [skillsDraft, setSkillsDraft] =
    useState<SkillDraft[]>(initialSkillsDraft);
  const [editor, setEditor] = useState<SkillEditorState>({
    mode: "closed",
  });
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicanSkillsMutation = useUpdateTechnicianSkillsMutation();

  // Map - unitId: skill draft for this unitId
  const skillsDraftByUnitId = useMemo(() => {
    const map = new Map<string, SkillDraft[]>();

    skillsDraft?.forEach((draft) => {
      const currentDraftForUnit = map.get(draft.unitId) ?? [];
      currentDraftForUnit.push(draft);
      map.set(draft.unitId, currentDraftForUnit);
    });

    return map;
  }, [skillsDraft]);

  //Editor handlers
  const toggleOpenEditSkill = () => {
    setDuplicateError(null);

    setEditor((prev) =>
      prev.mode === "closed" ? { mode: "add" } : { mode: "closed" },
    );
  };
  const handleOpenEditSkill = (skill: SkillDraft) => {
    setDuplicateError(null);
    setEditor({ mode: "edit", skill });
  };
  const isEditorOpen = editor.mode !== "closed";
  const selectedSkill = editor.mode === "edit" ? editor.skill : undefined;

  const handleRemoveSkill = (key: string) => {
    setSkillsDraft((prev) => prev.filter((s) => s.key !== key));
  };

  //Check for duplicates
  const isDuplicateSkill = (next: SkillDraft) =>
    skillsDraft.some(
      (skill) =>
        skill.key !== next.key &&
        getSkillIdentity(skill) === getSkillIdentity(next),
    );

  // patch and submit logic
  const patch = useMemo(
    () => createSkillsPatch(technicianSkills, skillsDraft),
    [technicianSkills, skillsDraft],
  );

  const isDirty =
    patch.addedSkills.length > 0 || patch.removedSkillIds.length > 0;
  const isPending = updateTechnicanSkillsMutation.isPending;

  const handleDiscardChanges = () => {
    setDuplicateError(null);
    setSkillsDraft(initialSkillsDraft);
  };

  // Null source Id on edit skill, add new skill to skillsDraft array on add skill
  const handleSubmitSkill = (next: SkillDraft) => {
    // return early on unchanged skill
    const isSkillUnchanged =
      editor.mode === "edit" &&
      getSkillIdentity(editor.skill) === getSkillIdentity(next);

    if (isSkillUnchanged) {
      setEditor({ mode: "closed" });
      return;
    }

    if (isDuplicateSkill(next)) {
      setDuplicateError(
        "Technician already has a skill of this type, please add a unique skill",
      );
      return;
    }

    setSkillsDraft((prev) =>
      editor.mode === "edit"
        ? prev.map((skill) =>
            skill.key === editor.skill.key
              ? { ...next, key: skill.key, sourceId: null }
              : skill,
          )
        : [...prev, next],
    );

    setEditor({ mode: "closed" });
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDirty || isPending) return;

    updateTechnicanSkillsMutation.mutate(
      {
        technicianId,
        ...patch,
      },
      {
        onSuccess: (savedSkills) => {
          setSkillsDraft(createSkillsDraft(savedSkills));
          setDuplicateError(null);
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={`${formStyle} p-2`} onSubmit={handleSubmit} noValidate>
      {/* Header Section - Add Technician Skill and Title */}
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader
            label="Edit Skills"
            subtext="Add or remove technician skills"
          />

          <button
            type="button"
            disabled={isPending}
            onClick={toggleOpenEditSkill}
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
              {isEditorOpen ? "Close" : "Add Skill"}
            </span>
          </button>
        </div>

        <AnimatePresence>
          {editor.mode !== "closed" && (
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
                  isDisabled={isPending}
                  units={units}
                  unitsById={unitsById}
                  brandGroups={brandGroups}
                  specificIssues={specificIssues}
                  handleSubmitSkill={handleSubmitSkill}
                  duplicateError={duplicateError}
                  resetDuplicateError={() => setDuplicateError(null)}
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

      {/* Skills Grid */}
      <AnimatePresence initial={false} mode="wait">
        {skillsDraft.length > 0 ? (
          <motion.div
            key="skills-cointainer"
            className="columns-1 gap-3 md:columns-2"
            {...fadePresenceMotionProps}
          >
            {Array.from(skillsDraftByUnitId.entries()).map(
              ([unitId, currentUnitSkillDrafts]) => (
                <SkillGroup
                  key={unitId}
                  isDisabled={isPending}
                  unitName={unitsById.get(unitId)?.name}
                  skillDraftsForUnit={currentUnitSkillDrafts}
                  brandGroupById={brandGroupById}
                  specificIssuesById={specificIssuesById}
                  onEditSkill={handleOpenEditSkill}
                  onRemoveSkill={handleRemoveSkill}
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

      {/* Submit Area */}
      <SubmitArea
        error={updateTechnicanSkillsMutation.error}
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

export default SkillsForm;
