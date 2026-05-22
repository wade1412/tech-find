import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useMemo, useState } from "react";

type BrandOption = {
  id: string;
  label: string;
  groupLabel: string;
  groupOrder: number;
};

function BrandSelect() {
  const [selectedBrands, setSelectedBrands] = useState<BrandOption[]>([]);

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
  } = useBrandGroupsQuery();

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
      return a.label.localeCompare(b.label);
    });

    return sorted;
  }, [brands, brandGroups]);

  const errorMessage = brandsError?.message || brandGroupsError?.message;

  if (isBrandsPending || isBrandGroupsPending) {
    return <Skeleton variant="rounded" height={56} />;
  }

  if (isBrandsError || isBrandGroupsError) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <Autocomplete
        multiple
        value={selectedBrands}
        onChange={(_, newValue) => {
          setSelectedBrands(newValue);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={brandOptions}
        groupBy={(option) => option.groupLabel}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <TextField {...params} label="Brand" />}
      />
    </div>
  );
}

export default BrandSelect;
