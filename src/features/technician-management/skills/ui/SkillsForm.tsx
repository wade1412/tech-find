import { useEffect, useMemo, useState } from "react";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { formWithPaddingStyle } from "../../../../shared/styles/styles";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import { createSkillsDraft, createSkillsPatch } from "../model/skills.helpers";
import type { SkillDraft } from "../model/skills.types";
import { useUpdateTechnicianSkillsMutation } from "../model/useUpdateTechnicianSkillsMutation";
import SkillFields from "./SkillFields";

interface SkillsFormProps {
  technicianId: string;
  technicianSkills: TechnicianSkill[];
  units: Unit[];
  unitsById: Map<string, Unit>;
  brandGroups: BrandGroup[];
  brandGroupById: Map<string, BrandGroup>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
  onDirtyChange?: (isDirty: boolean) => void;
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
  onDirtyChange,
}: SkillsFormProps) {
  const initialSkills = useMemo(
    () => createSkillsDraft(technicianSkills),
    [technicianSkills],
  );
  const [skillsDraft, setSkillsDraft] = useState<SkillDraft[]>(initialSkills);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicianSkillsMutation = useUpdateTechnicianSkillsMutation();

  const patch = useMemo(
    () => createSkillsPatch(technicianSkills, skillsDraft),
    [technicianSkills, skillsDraft],
  );

  const isDirty =
    patch.addedSkills.length > 0 || patch.removedSkillIds.length > 0;
  const isPending = updateTechnicianSkillsMutation.isPending;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleDiscardChanges = () => {
    setSkillsDraft(initialSkills);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDirty || isPending) return;

    updateTechnicianSkillsMutation.mutate(
      {
        technicianId,
        ...patch,
      },
      {
        onSuccess: (savedSkills) => {
          setSkillsDraft(createSkillsDraft(savedSkills));
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={formWithPaddingStyle} onSubmit={handleSubmit} noValidate>
      <SkillFields
        skills={skillsDraft}
        onChange={setSkillsDraft}
        units={units}
        unitsById={unitsById}
        brandGroups={brandGroups}
        brandGroupById={brandGroupById}
        specificIssues={specificIssues}
        specificIssuesById={specificIssuesById}
        disabled={isPending}
      />

      <FormSubmitArea
        error={updateTechnicianSkillsMutation.error}
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

export default SkillsForm;
