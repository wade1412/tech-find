import { useMemo, useState, type SyntheticEvent } from "react";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { Autocomplete, TextField } from "@mui/material";
import { selectStyle } from "../../../../shared/styles/muiSelectStyles";

type ZoneOption = {
  label: string;
  id: string;
};

interface ServiceZonesFormProps {
  zones: ServiceZone[];
  technicianZones: ServiceZone[];
  currentZonesIds: string[];
  handleAddZone: (newValue: string) => void;
  handleZoneDelete: (zoneName: string) => void;
}

function ServiceZonesForm({
  zones,
  technicianZones,
  currentZonesIds,
  handleAddZone,
  handleZoneDelete,
}: ServiceZonesFormProps) {
  const [inputValue, setInputValue] = useState("");

  const zoneOptions: ZoneOption[] = useMemo(
    () =>
      zones?.map((zone) => {
        return { label: zone.name, id: zone.id };
      }) || [],
    [zones],
  );

  const technicianZoneIdsSet = new Set(currentZonesIds);

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

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {technicianZones?.map((zone) => (
          <div
            key={zone.id}
            className="focus-visible:ring-main-500 cursor-pointer overflow-hidden rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:outline-none border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:hover:border-zinc-600 p-4 flex gap-4 justify-between items-center"
          >
            <span>{zone.name}</span>
            <button
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
  );
}

export default ServiceZonesForm;
