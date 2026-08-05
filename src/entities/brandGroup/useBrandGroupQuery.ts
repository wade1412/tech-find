import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getBrandGroupById } from "./brandGroup.api";

export const useBrandGroupQuery = (brandGroupId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.brandGroups.detail(brandGroupId ?? "missing"),
    queryFn: () =>
      brandGroupId
        ? getBrandGroupById(brandGroupId)
        : Promise.resolve(null),
    enabled: Boolean(brandGroupId),
  });
