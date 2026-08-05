import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getSpecificIssueById } from "./specific-issue.api";

export const useSpecificIssueQuery = (specificIssueId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.specificIssues.detail(specificIssueId ?? "missing"),
    queryFn: () =>
      specificIssueId
        ? getSpecificIssueById(specificIssueId)
        : Promise.resolve(null),
    enabled: Boolean(specificIssueId),
  });
