import { useMemo, type SyntheticEvent } from "react";
import { useSpecificIssuesQuery } from "../useSpecificIssuesQuery";
import { useUnitsQuery } from "../../unit/useUnitsQuery";
import { useTechnicianFilters } from "../../../features/technician-filter/model/useTechnicianFilters";
import { Autocomplete, Skeleton, TextField } from "@mui/material";

type issueOption = {
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
    isError: isUnitsError,
    error: unitsError,
  } = useUnitsQuery();

  const issueOptions = useMemo<issueOption[]>(() => {
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

  const selectedUnits = units?.filter((unit) =>
    filter.unitSlugs.includes(unit.slug),
  );

  const availableOptions = useMemo(
    () =>
      issueOptions.filter((opt) =>
        selectedUnits?.map((u) => u.id).includes(opt.unitId),
      ),
    [issueOptions, selectedUnits],
  );

  const selectedIssues = useMemo(() => {
    return availableOptions.filter((opt) =>
      filter.specificIssueSlugs.includes(opt.slug),
    );
  }, [filter.specificIssueSlugs, availableOptions]);

  const handleOptionChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: issueOption[],
  ) => {
    const slugs = newValue.map((v) => v.slug);
    updateSpecificIssueSlugs(slugs);
  };

  if (isIssuesError || isUnitsError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {issuesError?.message ?? unitsError?.message}
      </div>
    );
  }

  if (isIssuesPending) {
    return <Skeleton variant="rounded" height={56} />;
  }

  return (
    <div
      className={`flex flex-col gap-1.5 ${availableOptions.length > 0 ? "max-h-24" : "max-h-0"}`}
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
          chip: { color: "primary", variant: "outlined", size: "small" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
          "& .MuiChip-root": { borderRadius: "0.5rem", fontWeight: 600 },
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
            {
              borderStyle: "dashed",
            },
          "& .MuiOutlinedInput-root.Mui-disabled": { pointerEvents: "none" },
        }}
        renderInput={(params) => (
          <TextField {...params} label="Specific issue" />
        )}
      />
    </div>
  );
}

export default SpecificIssueSelect;
