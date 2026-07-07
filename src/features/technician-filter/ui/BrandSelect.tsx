import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useMemo, type SyntheticEvent } from "react";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import {
  selectSlotPropsStyle,
  selectStyle,
} from "../../../shared/styles/muiSelectStyles";
import ErrorMessage from "../../../shared/ui/ErrorMessage";
import { autocompleteMutedStyle } from "../../../shared/styles/styles";
import { AnimatePresence, motion } from "motion/react";
import {
  fadePresenceMotionProps,
  softLayoutTransition,
} from "../../../shared/styles/motionVariants";

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

  const canSelectBrand = filter.unitSlugs.length > 0 && !filter.isCommercial;

  if (isBrandsError || isBrandGroupsError) {
    return (
      <ErrorMessage
        message={brandsError?.message ?? brandGroupsError?.message}
      />
    );
  }

  if (isBrandsPending || isBrandGroupsPending) {
    return <Skeleton variant="rounded" height={56} />;
  }

  const mutedMessage = filter.isCommercial
    ? "Brand filter is unavailable for commercial jobs"
    : "Select a unit to filter by brand";

  return (
    <motion.div layout transition={softLayoutTransition}>
      <AnimatePresence initial={false} mode="wait">
        {!canSelectBrand ? (
          <motion.p
            key="brand-muted"
            className={autocompleteMutedStyle}
            {...fadePresenceMotionProps}
          >
            {mutedMessage}
          </motion.p>
        ) : (
          <motion.div key="brand-select" {...fadePresenceMotionProps}>
            <Autocomplete
              multiple
              value={selectedBrands}
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
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default BrandSelect;
