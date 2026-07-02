import type { Technician } from "../../../../entities/technician/technician.types";
import TechnicianSkeleton from "../../../../entities/technician/ui/TechnicianSkeleton";
import ErrorMessage from "../../../../shared/ui/ErrorMessage";
import SkillsForm from "./SkillsForm";
import { useTechnicianSkillEditorData } from "../model/useTechnicianSkillEditorData";

interface SkillSectionProps {
  technician: Technician;
}

function SkillsSection({ technician }: SkillSectionProps) {
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
    return <TechnicianSkeleton />;
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
    />
  );
}

export default SkillsSection;
