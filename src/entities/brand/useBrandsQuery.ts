import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getBrands } from "./brand.api";

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: queryKeys.brands,
    queryFn: getBrands,
  });
};
