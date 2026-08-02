import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { normalizeSearchText } from "../../../../shared/model/helpers";
import type { ServiceStatusFilterValue } from "../../model/servicesListFilters.constants";

interface FilterSpecificIssuesParams {
  searchTerm: string;
  specificIssues: SpecificIssue[];
  status: ServiceStatusFilterValue;
  unitsById: ReadonlyMap<string, Unit>;
}

export const isSpecificIssueEffectivelyActive = (
  specificIssue: SpecificIssue,
  unit: Unit | undefined,
) => specificIssue.active && unit?.active === true;

export const filterSpecificIssues = ({
  searchTerm,
  specificIssues,
  status,
  unitsById,
}: FilterSpecificIssuesParams) => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm ? normalizedSearchTerm.split(" ") : [];

  return specificIssues.filter((specificIssue) => {
    const unit = unitsById.get(specificIssue.unit_id);
    const isEffectivelyActive = isSpecificIssueEffectivelyActive(
      specificIssue,
      unit,
    );
    const matchesStatus =
      status === "all" || isEffectivelyActive === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const searchableText = normalizeSearchText(
      [specificIssue.name, specificIssue.slug, unit?.name, unit?.slug].join(" "),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};
