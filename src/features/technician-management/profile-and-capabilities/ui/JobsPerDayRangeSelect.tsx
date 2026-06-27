import { useTheme } from "@mui/material/styles";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { JobsPerDayDraft } from "../model/profile.types";
import {
  compactSelectStyle,
  selectMenuProps,
} from "../../../../shared/styles/muiSelectStyles";

interface JobsPerDayRangeSelectProps {
  value: JobsPerDayDraft;
  onChange: (next: JobsPerDayDraft) => void;
  disabled?: boolean;
}

const JOB_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 1);

function JobsPerDayRangeSelect({
  value,
  onChange,
  disabled,
}: JobsPerDayRangeSelectProps) {
  const theme = useTheme();
  const fieldStyle = compactSelectStyle(theme);

  const handleMinChange = (e: SelectChangeEvent<number>) => {
    const nextMin = Number(e.target.value);
    onChange({ min: nextMin, max: Math.max(nextMin, value.max) });
  };

  const handleMaxChange = (e: SelectChangeEvent<number>) => {
    const nextMax = Number(e.target.value);
    onChange({ min: Math.min(value.min, nextMax), max: nextMax });
  };

  return (
    <div className="flex items-center gap-2">
      <FormControl sx={fieldStyle} disabled={disabled}>
        <Select
          value={value.min}
          onChange={handleMinChange}
          MenuProps={selectMenuProps(theme)}
          inputProps={{ "aria-label": "Minimum jobs per day" }}
        >
          {JOB_OPTIONS.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <span className="text-sm text-zinc-400 dark:text-zinc-500">–</span>

      <FormControl sx={fieldStyle} disabled={disabled}>
        <Select
          value={value.max}
          onChange={handleMaxChange}
          MenuProps={selectMenuProps(theme)}
          inputProps={{ "aria-label": "Maximum jobs per day" }}
        >
          {JOB_OPTIONS.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default JobsPerDayRangeSelect;
