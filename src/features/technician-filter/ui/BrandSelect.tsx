import { Skeleton } from "@mui/material";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useBrandsGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useMemo } from "react";

type BrandOption = {
  id: string;
  label: string;
  groupLabel: string;
  groupOrder: number;
};

function BrandSelect() {
  const {
    data: brands,
    isPending: isBrandsPending,
    isError: isBrandsError,
    error: brandsError,
  } = useBrandsQuery();

  const {
    data: brandGroups,
    isPending: isBrandGroupsPending,
    isError: isBrandGroupsError,
    error: brandGroupsError,
  } = useBrandsGroupsQuery();

  const brandOptions = useMemo<BrandOption[]>(() => {
    // Return early on empty data
    if (!brands || !brandGroups) return [];

    // Brand Groups Map for faster checking
    const groupsMap = new Map(brandGroups.map((g) => [g.id, g]));

    // Map brands to a BrandOption structure
    const mapped = brands.map((brand) => {
      // Get the group of a brand from map
      const group = groupsMap.get(brand.group_id);

      return {
        id: brand.id,
        label: brand.name,
        groupLabel: group ? group.name : "No group",
        groupOrder: group ? group.display_order : 999, // last in order if no value
      };
    });

    // Sort by group
    const sorted = mapped.sort((a, b) => {
      // Sort by group order first
      if (a.groupOrder !== b.groupOrder) {
        return a.groupOrder - b.groupOrder;
      }
      // Then sort alphabetically
      return a.groupLabel.localeCompare(b.groupLabel);
    });

    return sorted;
  }, [brands, brandGroups]);

  const errorMessage = brandsError?.message || brandGroupsError?.message;

  return (
    <div>
      {(isBrandsPending || isBrandGroupsPending) && <Skeleton />}

      {(isBrandsError || isBrandGroupsError) && <h2>{errorMessage}</h2>}

      {brandOptions.map((b) => (
        <p key={b.id}>{b.label}</p>
      ))}
    </div>
  );
}

export default BrandSelect;
