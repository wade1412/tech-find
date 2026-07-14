import { describe, expect, it } from "vitest";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { SKILL_TEMPLATES } from "./skillTemplates.constants";
import {
  applySkillTemplate,
  getSkillTemplateAvailability,
} from "./skillTemplates.helpers";
import type { SkillDraft } from "./skills.types";

const makeUnit = (id: string, active = true): Unit => ({
  id,
  name: id,
  slug: id,
  active,
  display_order: 1,
  is_built_in: false,
  can_be_stacked: false,
  can_be_gas: false,
  can_be_commercial: true,
});

const makeBrandGroup = (
  id: string,
  slug: string,
  active = true,
): BrandGroup => ({
  id,
  name: id,
  slug,
  active,
  display_order: 1,
});

const units = [makeUnit("washer"), makeUnit("dryer")];
const brandGroups = [
  makeBrandGroup("standard-group", "standard"),
  makeBrandGroup("high-end-group", "high-end"),
];
const standardTemplate = SKILL_TEMPLATES[0];
const highEndTemplate = SKILL_TEMPLATES[1];

describe("applySkillTemplate", () => {
  it("adds a brand-group skill for every active unit", () => {
    const result = applySkillTemplate(
      [],
      units,
      brandGroups,
      standardTemplate,
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.addedCount).toBe(2);
    expect(result.skippedCount).toBe(0);
    expect(result.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          unitId: "washer",
          kind: "brandGroup",
          brandGroupId: "standard-group",
          sourceId: null,
        }),
        expect.objectContaining({
          unitId: "dryer",
          kind: "brandGroup",
          brandGroupId: "standard-group",
          sourceId: null,
        }),
      ]),
    );
    expect(new Set(result.skills.map((skill) => skill.key)).size).toBe(2);
  });

  it("adds only missing template skills", () => {
    const existingSkill: SkillDraft = {
      key: "existing-standard-washer",
      sourceId: null,
      unitId: "washer",
      kind: "brandGroup",
      brandGroupId: "standard-group",
    };

    const result = applySkillTemplate(
      [existingSkill],
      units,
      brandGroups,
      standardTemplate,
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.addedCount).toBe(1);
    expect(result.skippedCount).toBe(1);
    expect(result.skills[0]).toBe(existingSkill);
    expect(result.skills[1]).toMatchObject({
      unitId: "dryer",
      kind: "brandGroup",
      brandGroupId: "standard-group",
    });
  });

  it("is idempotent when the same template is applied twice", () => {
    const firstResult = applySkillTemplate(
      [],
      units,
      brandGroups,
      standardTemplate,
    );

    expect(firstResult.success).toBe(true);
    if (!firstResult.success) return;

    const secondResult = applySkillTemplate(
      firstResult.skills,
      units,
      brandGroups,
      standardTemplate,
    );

    expect(secondResult.success).toBe(true);
    if (!secondResult.success) return;

    expect(secondResult.addedCount).toBe(0);
    expect(secondResult.skippedCount).toBe(2);
    expect(secondResult.skills).toEqual(firstResult.skills);
  });

  it("treats Standard and High-End as different skills", () => {
    const standardResult = applySkillTemplate(
      [],
      units,
      brandGroups,
      standardTemplate,
    );

    expect(standardResult.success).toBe(true);
    if (!standardResult.success) return;

    const highEndResult = applySkillTemplate(
      standardResult.skills,
      units,
      brandGroups,
      highEndTemplate,
    );

    expect(highEndResult.success).toBe(true);
    if (!highEndResult.success) return;

    expect(highEndResult.addedCount).toBe(2);
    expect(highEndResult.skills).toHaveLength(4);
  });

  it("preserves existing commercial and specific-issue skills", () => {
    const existingSkills: SkillDraft[] = [
      {
        key: "commercial-washer",
        sourceId: null,
        unitId: "washer",
        kind: "commercial",
      },
      {
        key: "dryer-issue",
        sourceId: null,
        unitId: "dryer",
        kind: "specificIssue",
        specificIssueId: "issue-1",
      },
    ];

    const result = applySkillTemplate(
      existingSkills,
      units,
      brandGroups,
      standardTemplate,
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.skills.slice(0, 2)).toEqual(existingSkills);
    expect(result.skills).toHaveLength(4);
  });

  it("returns a controlled error when the brand group is unavailable", () => {
    const result = applySkillTemplate([], units, [], standardTemplate);
    const availability = getSkillTemplateAvailability(
      [],
      units,
      [],
      standardTemplate,
    );

    expect(result).toEqual({
      success: false,
      error:
        "The Standard — All Units template is unavailable because its brand group was not found.",
    });
    expect(availability).toEqual({
      status: "unavailable",
      error:
        "The Standard — All Units template is unavailable because its brand group was not found.",
    });
  });

  it("ignores inactive units", () => {
    const result = applySkillTemplate(
      [],
      [...units, makeUnit("inactive-unit", false)],
      brandGroups,
      standardTemplate,
    );

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.skills).toHaveLength(2);
    expect(result.skills.some((skill) => skill.unitId === "inactive-unit")).toBe(
      false,
    );
  });
});

describe("getSkillTemplateAvailability", () => {
  it("reports how many skills are still missing", () => {
    const currentSkills: SkillDraft[] = [
      {
        key: "existing-standard-washer",
        sourceId: null,
        unitId: "washer",
        kind: "brandGroup",
        brandGroupId: "standard-group",
      },
    ];

    expect(
      getSkillTemplateAvailability(
        currentSkills,
        units,
        brandGroups,
        standardTemplate,
      ),
    ).toEqual({
      status: "available",
      totalCount: 2,
      missingCount: 1,
    });
  });
});
