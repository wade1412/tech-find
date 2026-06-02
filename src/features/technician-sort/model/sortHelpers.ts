import type { SortDirection } from "@mui/material";
import { sortModes } from "./sort.constants";
import type { SortModeValue, SortTuple } from "./technicianSort.types";

const isValidSortMode = (mode: string): mode is SortModeValue => {
  return (sortModes as string[]).includes(mode);
};

export const parseStringToSortTuple = (sortStr: string): SortTuple => {
  const [mode, direction] = sortStr.split(".");

  const validMode: SortModeValue = isValidSortMode(mode) ? mode : "default";

  const validDirection: SortDirection = direction === "desc" ? "desc" : "asc";

  return [validMode, validDirection];
};
