import type { Unit } from "../../../../entities/unit/unit.types";
import { normalizeSearchText } from "../../../../shared/model/helpers";
import type { UnitStatusFilterValue } from "./unitListFilters.constants";

interface FilterUnitsParams {
  searchTerm: string;
  status: UnitStatusFilterValue;
  units: Unit[];
}

export const filterUnits = ({
  searchTerm,
  status,
  units,
}: FilterUnitsParams): Unit[] => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm
    ? normalizedSearchTerm.split(" ")
    : [];

  return units.filter((unit) => {
    const matchesStatus =
      status === "all" || unit.active === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const capabilities = [
      unit.can_be_commercial ? "commercial" : "",
      unit.can_be_gas ? "gas" : "",
      unit.can_be_stacked ? "stacked" : "",
      unit.is_built_in ? "built in lift" : "",
    ];
    const searchableText = normalizeSearchText(
      [
        unit.name,
        unit.slug,
        String(unit.display_order),
        ...capabilities,
      ].join(" "),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};
