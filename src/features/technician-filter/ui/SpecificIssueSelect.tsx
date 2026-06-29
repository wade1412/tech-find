import { useEffect, useMemo, type SyntheticEvent } from "react";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import { Autocomplete, Skeleton, TextField } from "@mui/material";
import {
  selectSlotPropsStyle,
  selectStyle,
} from "../../../shared/styles/muiSelectStyles";
import ErrorMessage from "../../../shared/ui/ErrorMessage";

type IssueOption = {
  id: string;
  slug: string;
  label: string;
  unitId: string;
};

function SpecificIssueSelect() {
  const { filter, updateSpecificIssueSlugs } = useTechnicianFilters();
  const {
    data: issues,
    isPending: isIssuesPending,
    isError: isIssuesError,
    error: issuesError,
  } = useSpecificIssuesQuery();
  const {
    data: units,
    isPending: isUnitsPending,
    isError: isUnitsError,
    error: unitsError,
  } = useUnitsQuery();

  const issueOptions = useMemo<IssueOption[]>(() => {
    if (!issues) return [];

    const mapped = issues.map((issue) => {
      return {
        id: issue.id,
        slug: issue.slug,
        label: issue.name,
        unitId: issue.unit_id,
      };
    });

    const sorted = mapped.sort((a, b) => a.label.localeCompare(b.label));

    return sorted;
  }, [issues]);

  const selectedUnitIds = useMemo(() => {
    if (!units) return new Set<string>();

    // Get selected unit Slugs
    const selectedSlugs = new Set(filter.unitSlugs);

    // Return a set from array of id's of selected Units
    return new Set(
      units
        .filter((unit) => selectedSlugs.has(unit.slug))
        .map((unit) => unit.id),
    );
  }, [units, filter.unitSlugs]);

  // Form available options, based on Unit Id's
  const availableOptions = useMemo(() => {
    return issueOptions.filter((opt) => selectedUnitIds.has(opt.unitId));
  }, [issueOptions, selectedUnitIds]);

  // Cleaned slugs for URL params sync in case selected units change
  const cleanedSelectedSlugs = useMemo(() => {
    // Form a set from all available option slugs
    const validSlugs = new Set(availableOptions.map((issue) => issue.slug));

    // Return an array of slugs that are relevant to selected units
    return filter.specificIssueSlugs.filter((slug) => validSlugs.has(slug));
  }, [availableOptions, filter.specificIssueSlugs]);

  const selectedIssues = useMemo(() => {
    // Use cleanedSlugs, so UI has valid state, before useEffect cleanup
    return availableOptions.filter((opt) =>
      cleanedSelectedSlugs.includes(opt.slug),
    );
  }, [cleanedSelectedSlugs, availableOptions]);

  const handleOptionChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: IssueOption[],
  ) => {
    const slugs = newValue.map((v) => v.slug);
    updateSpecificIssueSlugs(slugs);
  };

  useEffect(() => {
    if (isIssuesPending || isUnitsPending) return;

    // In case there area differences in slugs during unit toggle -
    // sync URL params to current state of the select:
    // Update the params with slugs that are relevant to selected units
    if (
      cleanedSelectedSlugs.join(",") !== filter.specificIssueSlugs.join(",")
    ) {
      updateSpecificIssueSlugs(cleanedSelectedSlugs);
    }
  }, [
    isIssuesPending,
    isUnitsPending,
    cleanedSelectedSlugs,
    filter.specificIssueSlugs,
    updateSpecificIssueSlugs,
  ]);

  if (isIssuesError || isUnitsError) {
    return (
      <ErrorMessage message={issuesError?.message ?? unitsError?.message} />
    );
  }

  if (isIssuesPending || isUnitsPending) {
    return <Skeleton variant="rounded" height={56} />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={availableOptions.length === 0 ? "cursor-not-allowed" : ""}
      >
        <Autocomplete
          disabled={availableOptions.length === 0}
          multiple
          value={selectedIssues}
          onChange={handleOptionChange}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={availableOptions}
          getOptionLabel={(option) => option.label}
          slotProps={{
            chip: {
              variant: "filled",
              size: "small",
              sx: (theme) => selectSlotPropsStyle(theme),
            },
          }}
          sx={(theme) => selectStyle(theme)}
          renderInput={(params) => (
            <TextField {...params} label="Specific issue" />
          )}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          availableOptions.length === 0 ? "max-h-6" : "max-h-0"
        }`}
      >
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Select a unit to see specific issues
        </p>
      </div>
    </div>
  );
}

export default SpecificIssueSelect;
