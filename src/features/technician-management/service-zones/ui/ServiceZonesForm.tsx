import { useMemo, useState, type SyntheticEvent } from "react";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { Autocomplete, TextField } from "@mui/material";
import { selectStyle } from "../../../../shared/styles/muiSelectStyles";
import { useUpdateTechnicianServiceZonesMutation } from "../model/useUpdateTechnicianServiceZonesMutation";
import { buildTechnicianZonesPatch } from "../model/serviceZones.helpers";
import { formStyle } from "../../../../shared/styles/styles";
import SubmitArea from "../../ui/SubmitArea";
import SectionHeader from "../../ui/SectionHeader";
import SubmitSnackbar from "../../ui/SubmitSnackbar";

type ZoneOption = {
  label: string;
  id: string;
};

interface ServiceZonesFormProps {
  technicianId: string;
  zones: ServiceZone[];
  initialZoneIds: string[];
}

function ServiceZonesForm({
  technicianId,
  zones,
  initialZoneIds,
}: ServiceZonesFormProps) {
  const [draftZoneIds, setZoneIds] = useState<string[]>(initialZoneIds);
  const [inputValue, setInputValue] = useState("");
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicianZonesMutation =
    useUpdateTechnicianServiceZonesMutation();
  const isPending = updateTechnicianZonesMutation.isPending;

  //Zone Ids Sets
  const initialZoneIdsSet = useMemo(
    () => new Set(initialZoneIds),
    [initialZoneIds],
  );
  const draftZoneIdsSet = useMemo(() => new Set(draftZoneIds), [draftZoneIds]);

  // Get zones object array for this technician, based on current draft ids
  const technicianZones = useMemo(
    () => zones.filter((zone) => draftZoneIdsSet.has(zone.id)),
    [zones, draftZoneIdsSet],
  );

  // Form zone options and available options for Autocomplete
  const zoneOptions: ZoneOption[] = useMemo(
    () =>
      zones.map((zone) => {
        return { label: zone.name, id: zone.id };
      }),
    [zones],
  );
  const availableOptions = useMemo(
    () => zoneOptions.filter((opt) => !draftZoneIdsSet.has(opt.id)),
    [zoneOptions, draftZoneIdsSet],
  );

  // Handlers for Zone changes
  const handleAddZone = (zoneId: string) =>
    setZoneIds((current) =>
      current.includes(zoneId) ? current : [...current, zoneId],
    );
  const handleZoneChange = (
    _: SyntheticEvent<Element, Event>,
    option: ZoneOption | null,
  ) => {
    if (!option) return;

    handleAddZone(option.id);
    setInputValue("");
  };
  const handleZoneChipDelete = (zoneId: string) => {
    if (!zoneId) return;
    setZoneIds((prev) => prev.filter((p) => p !== zoneId));
  };

  const patch = useMemo(
    () => buildTechnicianZonesPatch(initialZoneIdsSet, draftZoneIdsSet),
    [initialZoneIdsSet, draftZoneIdsSet],
  );
  const isDirty = patch.addedIds.length > 0 || patch.removedIds.length > 0;

  const handleDiscardChanges = () => {
    setZoneIds(initialZoneIds);
    setInputValue("");
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDirty || isPending) return;

    updateTechnicianZonesMutation.mutate(
      {
        technicianId,
        ...patch,
      },
      {
        onSuccess: () => {
          setInputValue("");
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={formStyle} onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.6fr)] md:gap-6">
        {/* Add Zone */}
        <div className="flex min-w-0 flex-col gap-3">
          <SectionHeader
            label="Add zone"
            subtext="Select a service zone to assign it to this technician"
          />

          <Autocomplete
            disabled={isPending}
            value={null}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            onChange={handleZoneChange}
            options={availableOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            sx={(theme) => ({
              ...selectStyle(theme),
            })}
            renderInput={(params) => (
              <TextField {...params} label="Select zone" />
            )}
            noOptionsText="All zones assigned"
          />
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-zinc-200 md:h-auto md:w-px md:self-stretch dark:bg-zinc-800"
        />

        {/* Assigned Zones */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <SectionHeader
              label="Assigned zones"
              subtext={
                technicianZones.length > 0
                  ? `${technicianZones.length} zone${technicianZones.length === 1 ? "" : "s"} currently assigned`
                  : "No zones assigned yet"
              }
            />
          </div>

          {/* Zone Chips */}
          {technicianZones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technicianZones.map((zone) => (
                <div
                  key={zone.id}
                  className="inline-flex max-w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm shadow-sm dark:border-zinc-700/70 dark:bg-zinc-800/60"
                >
                  <span className="max-w-40 truncate font-medium text-zinc-800 dark:text-zinc-100">
                    {zone.name}
                  </span>

                  <button
                    type="button"
                    disabled={isPending}
                    className="-mr-1 inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    aria-label={`Remove ${zone.name}`}
                    onClick={() => handleZoneChipDelete(zone.id)}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-6 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-500">
              No zones assigned. Use the selector to add one.
            </div>
          )}
        </div>
      </div>

      {/* Submit Area */}
      <SubmitArea
        error={updateTechnicianZonesMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        handleDiscardChanges={handleDiscardChanges}
      />

      {/* Success Snackbar */}
      <SubmitSnackbar
        isOpen={isSavedSnackbarOpen}
        handleClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default ServiceZonesForm;
