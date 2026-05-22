import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getBrandGroups } from "./brandGroup.api";

export const useBrandsGroupsQuery = () => {
  return useQuery({
    queryKey: queryKeys.brandGroups,
    queryFn: getBrandGroups,
  });
};
