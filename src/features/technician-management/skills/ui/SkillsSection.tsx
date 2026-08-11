import type { Technician } from "../../../../entities/technician/technician.types";
import ErrorMessage from "../../../../shared/ui/ErrorMessage";
import ManagementSectionSkeleton from "../../ui/ManagementSectionSkeleton";
import SkillsForm from "./SkillsForm";
import { useTechnicianSkillEditorData } from "../model/useTechnicianSkillEditorData";

interface SkillSectionProps {
  technician: Technician;
  onDirtyChange?: (isDirty: boolean) => void;
}

function SkillsSection({ technician, onDirtyChange }: SkillSectionProps) {
  const {
    technicianSkills,
    units,
    unitsById,
    brandGroups,
    brandGroupById,
    specificIssues,
    specificIssuesById,
    isPending,
    isError,
    error,
  } = useTechnicianSkillEditorData(technician.id);

  if (isPending) {
    return <ManagementSectionSkeleton variant="skills" />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <SkillsForm
      technicianId={technician.id}
      technicianSkills={technicianSkills}
      units={units ?? []}
      unitsById={unitsById}
      brandGroups={brandGroups ?? []}
      brandGroupById={brandGroupById}
      specificIssues={specificIssues ?? []}
      specificIssuesById={specificIssuesById}
      onDirtyChange={onDirtyChange}
    />
  );
}

export default SkillsSection;
