import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { normalizeSearchText } from "../../../../shared/model/helpers";
import type { ServiceStatusFilterValue } from "../../model/servicesListFilters.constants";

type FilterServiceZonesParams = {
  serviceZones: ServiceZone[];
  searchTerm: string;
  status: ServiceStatusFilterValue;
};

export const filterServiceZones = ({
  serviceZones,
  searchTerm,
  status,
}: FilterServiceZonesParams) => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm ? normalizedSearchTerm.split(" ") : [];

  return serviceZones.filter((zone) => {
    const matchesStatus =
      status === "all" || zone.active === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const searchableText = normalizeSearchText(
      [zone.name, zone.slug, zone.display_order].join(" "),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};
