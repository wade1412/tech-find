import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useMemo, type SyntheticEvent } from "react";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import {
  selectSlotPropsStyle,
  selectStyle,
} from "../../../shared/styles/muiSelectStyles";

type BrandOption = {
  id: string;
  slug: string;
  label: string;
  groupLabel: string;
  groupOrder: number;
};

function BrandSelect() {
  const { filter, updateBrandSlugs } = useTechnicianFilters();
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
        slug: brand.slug,
        label: brand.name,
        groupLabel: group ? group.name : "No group",
        groupOrder: group ? group.display_order : 999, // last in order if no value
      };
    });

    const sorted = mapped.sort((a, b) => {
      // Sort by group order
      if (a.groupOrder !== b.groupOrder) {
        return a.groupOrder - b.groupOrder;
      }
      // Sort alphabetically
      return a.label.localeCompare(b.label);
    });

    return sorted;
  }, [brands, brandGroups]);

  const selectedBrands = useMemo(() => {
    return brandOptions.filter((option) =>
      filter.brandSlugs.includes(option.slug),
    );
  }, [brandOptions, filter.brandSlugs]);

  const handleOptionChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: BrandOption[],
  ) => {
    const slugs = newValue.map((v) => v.slug);
    updateBrandSlugs(slugs);
  };

  if (isBrandsError || isBrandGroupsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {brandsError?.message ?? brandGroupsError?.message}
      </div>
    );
  }

  if (isBrandsPending || isBrandGroupsPending) {
    return <Skeleton variant="rounded" height={56} />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className={filter.isCommercial ? "cursor-not-allowed" : ""}>
        <Autocomplete
          disabled={filter.isCommercial}
          multiple
          value={filter.isCommercial ? [] : selectedBrands}
          onChange={handleOptionChange}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={brandOptions}
          groupBy={(option) => option.groupLabel}
          getOptionLabel={(option) => option.label}
          slotProps={{
            chip: {
              variant: "filled",
              size: "small",
              sx: (theme) => selectSlotPropsStyle(theme),
            },
          }}
          sx={(theme) => selectStyle(theme)}
          renderInput={(params) => <TextField {...params} label="Brand" />}
        />{" "}
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          filter.unitSlugs.length === 0 ? "max-h-6" : "max-h-0"
        }`}
      >
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Select a unit to filter by brands
        </p>
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 ${filter.isCommercial ? "max-h-6" : "max-h-0"}`}
      >
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Brand filter is unavailable for commercial jobs
        </p>
      </div>
    </div>
  );
}

export default BrandSelect;
