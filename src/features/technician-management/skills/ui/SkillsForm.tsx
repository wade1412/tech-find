import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { useMemo, useState } from "react";
import SectionHeader from "../../ui/SectionHeader";
import { formStyle } from "../../../../shared/styles/styles";
import type { SkillDraft } from "../model/skills.types";
import { createSkillsDraft, createSkillsPatch } from "../model/skills.helpers";
import SkillGroup from "./SkillGroup";
import SubmitSnackbar from "../../ui/SubmitSnackbar";
import SubmitArea from "../../ui/SubmitArea";

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
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

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

  const handleRemove = (key: string) => {
    setSkillsDraft((prev) => prev.filter((s) => s.key !== key));
  };

  const patch = useMemo(
    () => createSkillsPatch(technicianSkills, skillsDraft),
    [technicianSkills, skillsDraft],
  );
  const isDirty =
    patch.addedSkills.length > 0 || patch.removedSkillIds.length > 0;

  const handleDiscardChanges = () => setSkillsDraft(initialSkillsDraft);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDirty) return;

    //mutation
    setIsSavedSnackbarOpen(true);
    return;
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      {/* Header Section - Add Technician and Title */}
      <section className="flex flex-row justify-between">
        <SectionHeader
          label="Edit Skills"
          subtext="Add or remove technician skills"
        />

        <button type="button">Add Skill</button>
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
                  unitName={unitsById.get(unitId)?.name}
                  skillDraftsForUnit={currentUnitSkillDrafts}
                  brandGroupById={brandGroupById}
                  specificIssuesById={specificIssuesById}
                  onRemove={handleRemove}
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
        error="error"
        isDirty={isDirty}
        isPending="isPending"
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
