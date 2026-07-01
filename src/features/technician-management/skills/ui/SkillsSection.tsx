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
    unitsById,
    brandGroupById,
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
      technicianSkills={technicianSkills || []}
      unitsById={unitsById}
      brandGroupById={brandGroupById}
      specificIssuesById={specificIssuesById}
    />
  );
}

export default SkillsSection;
