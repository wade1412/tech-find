import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getBrandGroups } from "./brandGroup.api";
import type { BrandGroupStatus } from "./brandGroup.types";

export const useBrandGroupsQuery = (
  status: BrandGroupStatus = "active",
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.brandGroups[status],
    queryFn: () => getBrandGroups(status),
    enabled,
  });
};
