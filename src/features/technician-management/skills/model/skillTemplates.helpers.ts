import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { getSkillIdentity } from "./skills.helpers";
import type { SkillDraft } from "./skills.types";
import type { SkillTemplateDefinition } from "./skillTemplates.types";

export const applySkillTemplate = (
  currentSkills: SkillDraft[],
  units: Unit[],
  brandGroups: BrandGroup[],
  template: SkillTemplateDefinition,
) => {
  const brandGroup = brandGroups.find(
    (group) => group.slug === template.brandGroupSlug,
  );

  if (!brandGroup) {
    throw new Error(`Brand group "${template.brandGroupSlug}" not found`);
  }

  const exisitngIdentities = new Set(currentSkills.map(getSkillIdentity));

  const templateSkills: SkillDraft[] = units.map((unit) => ({
    key: crypto.randomUUID(),
    sourceId: null,
    unitId: unit.id,
    kind: "brandGroup",
    brandGroupId: brandGroup.id,
  }));

  const addedSkills = templateSkills.filter(
    (templateSkill) => !exisitngIdentities.has(getSkillIdentity(templateSkill)),
  );

  return {
    skills: [...currentSkills, ...addedSkills],
    addedCount: addedSkills.length,
    skippedCount: templateSkills.length - addedSkills.length,
  };
};
