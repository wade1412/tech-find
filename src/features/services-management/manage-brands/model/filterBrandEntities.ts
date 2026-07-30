import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { normalizeSearchText } from "../../../../shared/model/helpers";
import type { ServiceStatusFilterValue } from "../../model/servicesListFilters.constants";

type FilterBrandsParams = {
  brands: Brand[];
  brandGroupsById: ReadonlyMap<string, BrandGroup>;
  searchTerm: string;
  status: ServiceStatusFilterValue;
};

type FilterBrandGroupsParams = {
  brandGroups: BrandGroup[];
  searchTerm: string;
  status: ServiceStatusFilterValue;
};

const getBrandGroupSearchableText = (brandGroup: BrandGroup) =>
  normalizeSearchText([brandGroup.name, brandGroup.slug].join(" "));

export const filterBrands = ({
  brands,
  brandGroupsById,
  searchTerm,
  status,
}: FilterBrandsParams) => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm ? normalizedSearchTerm.split(" ") : [];

  return brands.filter((brand) => {
    const matchesStatus =
      status === "all" || brand.active === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const searchableText = normalizeSearchText(
      [brand.name, brand.slug, brandGroupsById.get(brand.group_id)?.name].join(
        " ",
      ),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};

export const filterBrandGroups = ({
  brandGroups,
  searchTerm,
  status,
}: FilterBrandGroupsParams) => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm ? normalizedSearchTerm.split(" ") : [];

  return brandGroups.filter((group) => {
    const matchesStatus =
      status === "all" || group.active === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const searchableText = getBrandGroupSearchableText(group);

    return terms.every((term) => searchableText.includes(term));
  });
};
