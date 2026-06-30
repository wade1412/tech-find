import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";

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
  return <div>SkillsForm</div>;
}

export default SkillsForm;
