import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { sortOptions } from "../sort.constants";
import type { SortTuple } from "../technicianSort.types";

interface TechnicianSortSelectProps {
  currentSortOption: SortTuple;
  updateSort: (newValue: string) => void;
}

const TechnicianSortSelect = ({
  currentSortOption,
  updateSort,
}: TechnicianSortSelectProps) => {
  const [value, sortOrder] = currentSortOption;
  const isDesc = sortOrder === "desc";

  const selectedOption = sortOptions.find((opt) => opt.value === value) || null;

  const handleValueChange = (e: SelectChangeEvent<string>) => {
    updateSort(`${e.target.value}.${isDesc ? "desc" : "asc"}`);
  };

  const toggleOrder = () => {
    if (value) {
      updateSort(`${selectedOption?.value}.${isDesc ? "asc" : "desc"}`);
    }
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-select">Sort</InputLabel>
        <Select
          labelId="sort-select"
          value={value}
          onChange={handleValueChange}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <button
        onClick={toggleOrder}
        className="text-sm font-medium text-main-500 hover:text-main-400 transition-colors cursor-pointer"
      >
        <div
          className={`flex text-center align-center transition-transform duration-350 font-light h-fit ${isDesc ? "rotate-180" : "rotate-0"}`}
        >
          👆
        </div>
      </button>
    </div>
  );
};

export default TechnicianSortSelect;
