import { useMemo } from "react";
import { useBrandGroupsQuery } from "../../../../entities/brandGroup/useBrandGroupsQuery";
import { createDataMapByTechnicianId } from "../../../shared/helpers";
import { useSpecificIssuesQuery } from "../../../../entities/specific-issue/useSpecificIssuesQuery";
import { useTechnicianSkillSetQuery } from "../../../../entities/technician-skill-set/technicianSkillSetQuery";
import { useUnitsQuery } from "../../../../entities/unit/useUnitsQuery";

export const useTechnicianSkillEditorData = (technicianId: string) => {
  const {
    data: skills,
    isPending: isSkillsPending,
    isError: skillsError,
    error: skillsErrorObject,
  } = useTechnicianSkillSetQuery();
  const {
    data: units,
    isPending: isUnitsPending,
    isError: isUnitsError,
    error: unitsErrorObject,
  } = useUnitsQuery();
  const {
    data: brandGroups,
    isPending: isBrandGroupsPending,
    isError: isBrandGroupsError,
    error: brandGroupsErrorObject,
  } = useBrandGroupsQuery();
  const {
    data: specificIssues,
    isPending: isSpecificIssuesPending,
    isError: isSpecificIssuesError,
    error: specificIssuesErrorObject,
  } = useSpecificIssuesQuery();

  const skillsByTechId = useMemo(
    () => createDataMapByTechnicianId(skills || []),
    [skills],
  );

  const technicianSkills = skillsByTechId.get(technicianId);

  // Map - unitId: unit
  const unitsById = useMemo(
    () => new Map(units?.map((u) => [u.id, u]) ?? []),
    [units],
  );
  // Map - brandGroupId: brandGroup
  const brandGroupById = useMemo(
    () => new Map(brandGroups?.map((b) => [b.id, b]) ?? []),
    [brandGroups],
  );
  // Map - issueId: issue
  const specificIssuesById = useMemo(
    () => new Map(specificIssues?.map((i) => [i.id, i]) ?? []),
    [specificIssues],
  );

  const isPending =
    isSkillsPending ||
    isUnitsPending ||
    isBrandGroupsPending ||
    isSpecificIssuesPending;
  const isError =
    skillsError || isUnitsError || isBrandGroupsError || isSpecificIssuesError;
  const error =
    skillsErrorObject ??
    unitsErrorObject ??
    brandGroupsErrorObject ??
    specificIssuesErrorObject;

  return {
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
  };
};
