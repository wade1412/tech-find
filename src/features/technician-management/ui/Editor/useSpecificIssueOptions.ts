import { useMemo } from "react";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { getSelectOptionsFromEntity } from "./editor.helpers";

export const useSpecificIssueOptions = (
  selectedUnitId: string | null,
  specificIssues: SpecificIssue[],
) => {
  const specificIssueUnitIds = useMemo(
    () => new Set(specificIssues.map((issue) => issue.unit_id)),
    [specificIssues],
  );

  const specificIssuesSelectOptions = useMemo(() => {
    if (!selectedUnitId) return [];

    if (!specificIssueUnitIds.has(selectedUnitId)) return [];

    const relevantIssues = specificIssues.filter(
      (issue) => issue.unit_id === selectedUnitId,
    );

    return getSelectOptionsFromEntity(relevantIssues);
  }, [specificIssues, selectedUnitId, specificIssueUnitIds]);

  return { specificIssuesSelectOptions, specificIssueUnitIds };
};
