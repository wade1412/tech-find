import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { TechnicianSkill } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { SkillDraft, SkillsPatch } from "./skills.types";

const createSkillDraft = (skill: TechnicianSkill): SkillDraft => {
  const baseFields = {
    key: skill.id,
    sourceId: skill.id,
    unitId: skill.unit_id,
  };

  const hasBrandGroup = skill.brand_group_id !== null;
  const hasSpecificIssue = skill.specific_issue_id !== null;

  const variantCount =
    Number(skill.commercial) + Number(hasBrandGroup) + Number(hasSpecificIssue);

  if (variantCount !== 1) throw new Error(`Invalid skill: ${skill.id}`);

  if (skill.commercial === true) {
    return {
      ...baseFields,
      kind: "commercial",
    };
  }

  if (skill.brand_group_id !== null) {
    return {
      ...baseFields,
      kind: "brandGroup",
      brandGroupId: skill.brand_group_id,
    };
  }

  if (skill.specific_issue_id !== null) {
    return {
      ...baseFields,
      kind: "specificIssue",
      specificIssueId: skill.specific_issue_id,
    };
  }

  throw new Error(`Unreachable skill structure: ${skill.id}`);
};

export const createSkillsDraft = (
  technicianSkills: TechnicianSkill[],
): SkillDraft[] => technicianSkills.map((skill) => createSkillDraft(skill));

export const skillDraftToInput = (skill: SkillDraft) => {
  const baseFields = {
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
};

// Edit with unchanged source Id wont be caught in patch, so Edit has to create new skill draft with sourceId: null and remove the old skill record
export const createSkillsPatch = (
  initialSkills: TechnicianSkill[],
  draftSkills: SkillDraft[],
): SkillsPatch => {
  const initialSkillIdsSet = new Set(initialSkills.map((s) => s.id));
  const draftSkillIdsSet = new Set(
    draftSkills.map((s) => s.sourceId).filter((id) => id !== null),
  );

  // Technician Id is added by api function
  const addedSkills = draftSkills
    .filter((skill) => skill.sourceId === null)
    .map(skillDraftToInput);

  const removedSkillIds = Array.from(initialSkillIdsSet).filter(
    (id) => !draftSkillIdsSet.has(id),
  );

  return {
    addedSkills,
    removedSkillIds,
  };
};

export const getSkillIdentity = (skill: SkillDraft) => {
  if (skill.kind === "commercial") {
    return `commercial:${skill.unitId}`;
  }

  if (skill.kind === "brandGroup") {
    return `brandGroup:${skill.unitId}:${skill.brandGroupId}`;
  }

  return `specificIssue:${skill.unitId}:${skill.specificIssueId}`;
};

const normalize = (value: string) => value.trim().toLowerCase();

const skillKindSearchLabels: Record<SkillDraft["kind"], string> = {
  commercial: "commercial",
  brandGroup: "brand group",
  specificIssue: "specific issue",
};

export const filterSkillsBySearch = (
  skills: SkillDraft[],
  searchTerm: string,
  unitsById: ReadonlyMap<string, Unit>,
  brandGroupsById: ReadonlyMap<string, BrandGroup>,
  specificIssuesById: ReadonlyMap<string, SpecificIssue>,
) => {
  const terms = normalize(searchTerm).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return skills;

  const getSkillSearchableString = (skill: SkillDraft) => {
    const fields = [
      unitsById.get(skill.unitId)?.name,
      skillKindSearchLabels[skill.kind],
    ];

    if (skill.kind === "brandGroup") {
      fields.push(brandGroupsById.get(skill.brandGroupId)?.name);
    }

    if (skill.kind === "specificIssue") {
      fields.push(specificIssuesById.get(skill.specificIssueId)?.name);
    }

    return normalize(fields.filter(Boolean).join(" "));
  };

  const foundSkills = skills.filter((skill) => {
    const searchableText = getSkillSearchableString(skill);

    return terms.every((term) => searchableText.includes(term));
  });

  return foundSkills;
};
