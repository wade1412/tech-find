import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getBrandById } from "./brand.api";

export const useBrandQuery = (brandId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.brands.detail(brandId ?? "missing"),
    queryFn: () => (brandId ? getBrandById(brandId) : Promise.resolve(null)),
    enabled: Boolean(brandId),
  });
