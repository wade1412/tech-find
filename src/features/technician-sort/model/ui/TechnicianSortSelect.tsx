//Sort Select UI

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SortSelectOption } from "../technicianSort.types";
import { useState } from "react";

const sortOptions: SortSelectOption[] = [
  { label: "", value: "default" },
  { label: "Name", value: "alias" },
  { label: "Zip", value: "home_zip_code" },
  { label: "Service Area", value: "service_area" },
];

const TechnicianSortSelect = () => {
  const [value, setValue] = useState("");

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-select">Sort</InputLabel>
        <Select
          labelId="sort-select"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <button>↑</button>
    </div>
  );
};

export default TechnicianSortSelect;
