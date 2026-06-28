import { useMemo, useState, type SyntheticEvent } from "react";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { Autocomplete, TextField } from "@mui/material";
import { selectStyle } from "../../../../shared/styles/muiSelectStyles";
import { useUpdateTechnicianMutation } from "../../model/useUpdateTechnicianMutation";

type ZoneOption = {
  label: string;
  id: string;
};

interface ServiceZonesFormProps {
  zones: ServiceZone[];
  initialZoneIds: string[];
}

function ServiceZonesForm({ zones, initialZoneIds }: ServiceZonesFormProps) {
  const [draftZoneIds, setZoneIds] = useState<string[]>(initialZoneIds);
  const [inputValue, setInputValue] = useState("");

  // Get zones object array for this technician, based on current draft ids
  const draftZoneIdsSet = new Set(draftZoneIds);
  const technicianZones = zones.filter((zone) => {
    return zone && draftZoneIdsSet.has(zone.id);
  });

  const handleAddZone = (zoneId: string) =>
    setZoneIds((current) =>
      current.includes(zoneId) ? current : [...current, zoneId],
    );

  const handleZoneDelete = (zoneId: string) => {
    if (!zoneId) return;
    setZoneIds((prev) => prev.filter((p) => p !== zoneId));
  };

  const zoneOptions: ZoneOption[] = useMemo(
    () =>
      zones.map((zone) => {
        return { label: zone.name, id: zone.id };
      }) || [],
    [zones],
  );

  const technicianZoneIdsSet = new Set(draftZoneIds);

  const availableOptions = zoneOptions.filter(
    (opt) => !technicianZoneIdsSet.has(opt.id),
  );

  const handleZoneChange = (
    _: SyntheticEvent<Element, Event>,
    option: ZoneOption | null,
  ) => {
    if (!option) return;

    handleAddZone(option.id);
    setInputValue("");
  };

  const updateTechnicianMutation = useUpdateTechnicianMutation();
  const isPending = updateTechnicianMutation.isPending;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {technicianZones?.map((zone) => (
            <div
              key={zone.id}
              className="focus-visible:ring-main-500 cursor-pointer overflow-hidden rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:outline-none border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:hover:border-zinc-600 p-4 flex gap-4 justify-between items-center"
            >
              <span>{zone.name}</span>
              <button
                type="button"
                className="border border-red-200 p-2 rounded-xl"
                onClick={() => handleZoneDelete(zone.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div>
          <Autocomplete
            value={null}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            onChange={handleZoneChange}
            options={availableOptions}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            getOptionLabel={(option) => option.label}
            sx={(theme) => ({
              ...selectStyle(theme),
            })}
            renderInput={(params) => <TextField {...params} label="Add Zone" />}
          />
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex flex-col gap-2 items-center justify-center p-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {updateTechnicianMutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            Failed to save changes. Try again
          </p>
        )}
      </div>
    </form>
  );
}

export default ServiceZonesForm;
