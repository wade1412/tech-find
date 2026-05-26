import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getSpecificIssues } from "./specific-issue.api";

export const useSpecificIssuesQuery = () => {
  return useQuery({
    queryKey: queryKeys.specificIssues,
    queryFn: getSpecificIssues,
  });
};
