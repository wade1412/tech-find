import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getBrands } from "./brand.api";
import type { BrandStatus } from "./brand.types";

export const useBrandsQuery = (
  status: BrandStatus = "active",
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.brands[status],
    queryFn: () => getBrands(status),
    enabled,
  });
};
