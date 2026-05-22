import { useQuery } from "@tanstack/react-query";
import { getUnits } from "./unit.api";
import { queryKeys } from "../../shared/api/queryKeys";

export const useUnitsQuery = () => {
  return useQuery({
    queryKey: queryKeys.units,
    queryFn: getUnits,
  });
};
