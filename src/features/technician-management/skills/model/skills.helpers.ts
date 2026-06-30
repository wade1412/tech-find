import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { SkillDraft, SkillsPatch } from "./skills.types";

type CreateSkillsPatch = (
  technicianId: string,
  initialSkills: TechnicianSkill[],
  draftSkills: SkillDraft[],
) => SkillsPatch;

const createSkillDraft = (skill: TechnicianSkill): SkillDraft => {
  const baseFields = {
    key: skill.id,
    sourceId: skill.id,
    unitId: skill.unit_id,
  };

  if (skill.specific_issue_id) {
    return {
      ...baseFields,
      kind: "specificIssue",
      specificIssueId: skill.specific_issue_id,
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
    kind: "commercial",
  };
};

export const createSkillsDraft = (
  technicianSkills: TechnicianSkill[],
): SkillDraft[] => technicianSkills.map((skill) => createSkillDraft(skill));

export const createSkillsPatch: CreateSkillsPatch = (
  technicianId,
  initialSkills,
  draftSkills,
) => {
  const initialSkillIdsSet = new Set(initialSkills.map((s) => s.id));
  const draftSkillIdsSet = new Set(
    draftSkills.map((s) => s.sourceId).filter((id) => id !== null),
  );

  const addedSkills = draftSkills
    .filter((skill) => skill.sourceId === null)
    .map((skill) => {
      const baseFields = {
        technician_id: technicianId,
        unit_id: skill.unitId,
        commercial: false,
        brand_group_id: null,
        specific_issue_id: null,
      };

      if (skill.kind === "brandGroup") {
        return { ...baseFields, brand_group_id: skill.brandGroupId };
      }

      if (skill.kind === "specificIssue") {
        return { ...baseFields, specific_issue_id: skill.specificIssueId };
      }

      return { ...baseFields, commercial: true };
    });

  const removedSkillIds = Array.from(initialSkillIdsSet).filter(
    (id) => !draftSkillIdsSet.has(id),
  );

  return {
    addedSkills,
    removedSkillIds,
  };
};
