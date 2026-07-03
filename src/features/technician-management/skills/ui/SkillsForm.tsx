import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { useMemo, useState } from "react";
import SectionHeader from "../../ui/SectionHeader";
import { formStyle } from "../../../../shared/styles/styles";
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

    skillsDraft?.map((draft) => {
      const currentDraftForUnit = map.get(draft.unitId) ?? [];
      currentDraftForUnit.push(draft);
      map.set(draft.unitId, currentDraftForUnit);
    });

    return map;
  }, [skillsDraft]);

  const handleOpenAddSkill = () => setEditor({ mode: "add" });
  const handleOpenEditSkill = (skill: SkillDraft) =>
    setEditor({ mode: "edit", skill });
  const handleCloseEditSkill = () => setEditor({ mode: "closed" });

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

  const patch = useMemo(
    () => createSkillsPatch(technicianSkills, skillsDraft),
    [technicianSkills, skillsDraft],
  );

  const isDirty =
    patch.addedSkills.length > 0 || patch.removedSkillIds.length > 0;
  const isPending = updateTechnicanSkillsMutation.isPending;

  const handleDiscardChanges = () => setSkillsDraft(initialSkillsDraft);

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
        onSuccess: () => {
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      {/* Header Section - Add Technician and Title */}
      <section className="flex flex-row justify-between">
        <SectionHeader
          label="Edit Skills"
          subtext="Add or remove technician skills"
        />

        {editor.mode !== "closed" && (
          <SkillEditor
            key={selectedSkill?.key ?? "new"}
            selectedSkillDraft={selectedSkill}
            isDisabled={isPending}
            units={units}
            unitsById={unitsById}
            brandGroups={brandGroups}
            specificIssues={specificIssues}
            handleSubmitSkill={handleSubmitSkill}
            handleEditorClose={handleCloseEditSkill}
            duplicateError={duplicateError}
            resetDuplicateError={() => setDuplicateError(null)}
          />
        )}

        <button type="button" onClick={handleOpenAddSkill}>
          Add Skill
        </button>
      </section>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
      />

      <section>
        {skillsDraft.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-6 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-500">
            No skills for this technician. Use "Add skill" button to add one
          </div>
        )}
      </section>

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
