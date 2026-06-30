import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { useState } from "react";
import SectionHeader from "../../ui/SectionHeader";
import { formStyle } from "../../../../shared/styles/styles";
import type { SkillDraft } from "../model/skills.types";
import SkillCard from "./SkillCard";

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
  const initialSkills: SkillDraft[] = technicianSkills.map((skill) => {
    const baseFields = {
      key: skill.id,
      sourceId: skill.id,
      unitId: skill.unit_id,
    };

    if (skill.commercial) {
      return {
        ...baseFields,
        kind: "commercial",
      };
    } else if (skill.brand_group_id) {
      return {
        ...baseFields,
        kind: "brandGroup",
        brandGroupId: skill.brand_group_id,
      };
    }
    return {
      ...baseFields,
      kind: "specificIssue",
      specificIssueId: skill.specific_issue_id ?? "",
    };
  });

  const [skillsDraft, setSkillsDraft] = useState<SkillDraft[]>(initialSkills);

  const handleSubmit = () => {
    return;
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      {/* Header Section - Add Technician and Title */}
      <section>
        <SectionHeader
          label="Edit Skills"
          subtext="Add or remove technician skills"
        />

        <button>Add Skill</button>
      </section>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-zinc-200 md:h-auto md:w-px md:self-stretch dark:bg-zinc-800"
      />

      <section>
        {skillsDraft.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {skillsDraft.map((skill) => {
              const brandGroupName =
                skill.kind === "brandGroup"
                  ? brandGroupById.get(skill.brandGroupId)?.name
                  : undefined;

              const specificIssueName =
                skill.kind === "specificIssue"
                  ? specificIssuesById.get(skill.specificIssueId)?.name
                  : undefined;

              return (
                <SkillCard
                  skill={skill}
                  unitName={unitsById.get(skill.unitId)?.name}
                  brandGroupName={brandGroupName}
                  specificIssueName={specificIssueName}
                />
              );
            })}{" "}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-6 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-500">
            No skills for this technician. Use "Add skill" button to add one
          </div>
        )}
      </section>

      {/* Submit Area
      <SubmitArea
        error={updateTechnicianZonesMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        handleDiscardChanges={handleDiscardChanges}
      />

      {/* Success Snackbar */}
      {/* <SubmitSnackbar
        isOpen={isSavedSnackbarOpen}
        handleClose={() => setIsSavedSnackbarOpen(false)}
      /> */}
    </form>
  );
}

export default SkillsForm;
