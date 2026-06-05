import { useMemo, type SyntheticEvent } from "react";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { useServiceZonesQuery } from "../../../entities/service-zone/useServiceZonesQuery";

type ZoneOption = {
  label: string;
  value: string;
};

function ZoneSelect() {
  const { filter, updateZone } = useTechnicianFilters();
  const { data: zones, isPending, isError, error } = useServiceZonesQuery();

  const zoneOptions: ZoneOption[] = useMemo(
    () =>
      zones?.map((zone) => {
        return { label: zone.name, value: zone.slug };
      }) || [],
    [zones],
  );

  const selectedZone = filter.zone
    ? zoneOptions.find((zoneOption) => zoneOption.value === filter.zone)
    : null;

  const handleZoneChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: ZoneOption | null,
  ) => {
    updateZone(newValue?.value ?? "");
  };

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error?.message}
      </div>
    );
  }

  if (isPending) {
    return <Skeleton variant="rounded" height={56} />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Autocomplete
        value={selectedZone}
        onChange={handleZoneChange}
        options={zoneOptions}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        getOptionLabel={(option) => option.label}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
          "& .MuiChip-root": { borderRadius: "0.5rem", fontWeight: 600 },
          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
            {
              borderStyle: "dashed",
            },
          "& .MuiOutlinedInput-root.Mui-disabled": { pointerEvents: "none" },
        }}
        renderInput={(params) => <TextField {...params} label="Zone" />}
      />
    </div>
  );
}

export default ZoneSelect;
