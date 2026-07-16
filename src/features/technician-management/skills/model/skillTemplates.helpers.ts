import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { getSkillIdentity } from "./skills.helpers";
import type { SkillDraft } from "./skills.types";
import type {
  ApplySkillTemplateResult,
  SkillTemplateAvailability,
  SkillTemplateDefinition,
} from "./skillTemplates.types";

const resolveTemplateData = (
  units: Unit[],
  brandGroups: BrandGroup[],
  template: SkillTemplateDefinition,
) => {
  const brandGroup = brandGroups.find(
    (group) => group.active && group.slug === template.brandGroupSlug,
  );

  if (!brandGroup) {
    return {
      success: false as const,
      error: `The ${template.label} template is unavailable because its brand group was not found.`,
    };
  }

  const relevantUnits = units.filter(
    (unit) => unit.active && template.includedUnitSlugs.has(unit.slug),
  );

  if (relevantUnits.length === 0) {
    return {
      success: false as const,
      error: `The ${template.label} template is unavailable because there are no eligible active units.`,
    };
  }

  return { success: true as const, activeUnits: relevantUnits, brandGroup };
};

const getTemplateSkillIdentity = (unitId: string, brandGroupId: string) =>
  `brandGroup:${unitId}:${brandGroupId}`;

export const getSkillTemplateAvailability = (
  currentSkills: SkillDraft[],
  units: Unit[],
  brandGroups: BrandGroup[],
  template: SkillTemplateDefinition,
): SkillTemplateAvailability => {
  const resolved = resolveTemplateData(units, brandGroups, template);

  if (!resolved.success) {
    return { status: "unavailable", error: resolved.error };
  }

  const existingIdentities = new Set(currentSkills.map(getSkillIdentity));
  const missingCount = resolved.activeUnits.filter(
    (unit) =>
      !existingIdentities.has(
        getTemplateSkillIdentity(unit.id, resolved.brandGroup.id),
      ),
  ).length;

  return {
    status: "available",
    totalCount: resolved.activeUnits.length,
    missingCount,
  };
};

export const applySkillTemplate = (
  currentSkills: SkillDraft[],
  units: Unit[],
  brandGroups: BrandGroup[],
  template: SkillTemplateDefinition,
): ApplySkillTemplateResult => {
  const resolved = resolveTemplateData(units, brandGroups, template);

  if (!resolved.success) {
    return { success: false, error: resolved.error };
  }

  const existingIdentities = new Set(currentSkills.map(getSkillIdentity));
  const missingUnits = resolved.activeUnits.filter(
    (unit) =>
      !existingIdentities.has(
        getTemplateSkillIdentity(unit.id, resolved.brandGroup.id),
      ),
  );

  const addedSkills: SkillDraft[] = missingUnits.map((unit) => ({
    key: crypto.randomUUID(),
    sourceId: null,
    unitId: unit.id,
    kind: "brandGroup",
    brandGroupId: resolved.brandGroup.id,
  }));

  return {
    success: true,
    skills: [...currentSkills, ...addedSkills],
    addedCount: addedSkills.length,
    skippedCount: resolved.activeUnits.length - addedSkills.length,
  };
};
