import { Autocomplete, TextField } from "@mui/material";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import SectionHeader from "../../ui/SectionHeader";
import { selectStyle } from "../../../../shared/styles/muiSelectStyles";
import { AnimatePresence, motion } from "motion/react";
import {
  fadePresenceMotionProps,
  softLayoutTransition,
} from "../../../../shared/styles/motionVariants";
import { noEditValuesStyle } from "../../../../shared/styles/styles";
import DeleteButton from "../../../../shared/ui/DeleteButton";
import { useMemo, useState, type SyntheticEvent } from "react";

type ZoneOption = {
  label: string;
  id: string;
};

interface ServiceZoneFieldsProps {
  zones: ServiceZone[];
  selectedZoneIds: string[];
  onChange: (zoneIds: string[]) => void;
  disabled: boolean;
}

function ServiceZoneFields({
  zones,
  selectedZoneIds,
  disabled,
  onChange,
}: ServiceZoneFieldsProps) {
  const [inputValue, setInputValue] = useState("");

  const selectedZoneIdsSet = useMemo(
    () => new Set(selectedZoneIds),
    [selectedZoneIds],
  );

  const selectedZones = useMemo(
    () => zones.filter((zone) => selectedZoneIdsSet.has(zone.id)),
    [zones, selectedZoneIdsSet],
  );

  const zoneOptions: ZoneOption[] = useMemo(
    () =>
      zones.map((zone) => {
        return { label: zone.name, id: zone.id };
      }),
    [zones],
  );
  const availableOptions = useMemo(
    () => zoneOptions.filter((opt) => !selectedZoneIdsSet.has(opt.id)),
    [zoneOptions, selectedZoneIdsSet],
  );

  const handleZoneChange = (_: SyntheticEvent, option: ZoneOption | null) => {
    if (!option || selectedZoneIdsSet.has(option.id)) return;

    onChange([...selectedZoneIds, option.id]);
    setInputValue("");
  };

  const handleZoneDelete = (zoneId: string) => {
    onChange(selectedZoneIds.filter((id) => id !== zoneId));
    setInputValue("");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      {/* Add Zone */}
      <div className="flex min-w-0 flex-col gap-3">
        <SectionHeader
          label="Add zone"
          subtext="Select a service zone to assign it to this technician"
        />

        <Autocomplete
          disabled={disabled}
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
        className="h-px w-full bg-zinc-200 lg:h-auto lg:w-px lg:self-stretch  dark:bg-zinc-800"
      />

      {/* Assigned Zones */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader
            label="Assigned zones"
            subtext={
              selectedZones.length > 0
                ? `${selectedZones.length} zone${selectedZones.length === 1 ? "" : "s"} currently assigned`
                : "No zones assigned yet"
            }
          />
        </div>

        {/* Zone Chips */}
        <motion.div layout transition={softLayoutTransition}>
          <AnimatePresence initial={false} mode="wait">
            {selectedZones.length > 0 ? (
              <motion.div
                key="zones-chips-container"
                className="flex flex-wrap gap-2"
                {...fadePresenceMotionProps}
              >
                {selectedZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="inline-flex max-w-full items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm shadow-sm dark:border-zinc-700/70 dark:bg-zinc-800/60"
                  >
                    <span className="max-w-40 truncate font-medium text-zinc-800 dark:text-zinc-100">
                      {zone.name}
                    </span>

                    <DeleteButton
                      label={zone.name}
                      isDisabled={disabled}
                      onDelete={() => {
                        handleZoneDelete(zone.id);
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="zones-empty"
                className={noEditValuesStyle}
                {...fadePresenceMotionProps}
              >
                No zones assigned. Use the selector to add one.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default ServiceZoneFields;
