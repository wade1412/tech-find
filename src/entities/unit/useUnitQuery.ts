import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getUnitById } from "./unit.api";

export const useUnitQuery = (unitId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.units.detail(unitId ?? "missing"),
    queryFn: () => (unitId ? getUnitById(unitId) : Promise.resolve(null)),
    enabled: Boolean(unitId),
  });
