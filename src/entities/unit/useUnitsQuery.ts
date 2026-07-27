import { useQuery } from "@tanstack/react-query";
import { getUnits } from "./unit.api";
import { queryKeys } from "../../shared/api/queryKeys";
import type { UnitStatus } from "./unit.types";

export const useUnitsQuery = (status: UnitStatus = "active") => {
  return useQuery({
    queryKey: queryKeys.units[status],
    queryFn: () => getUnits(status),
  });
};
