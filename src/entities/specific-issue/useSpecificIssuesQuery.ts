import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getSpecificIssues } from "./specific-issue.api";
import type { SpecificIssueStatus } from "./specific-issue.types";

export const useSpecificIssuesQuery = (
  status: SpecificIssueStatus = "active",
  enabled = true,
) =>
  useQuery({
    queryKey: queryKeys.specificIssues[status],
    queryFn: () => getSpecificIssues(status),
    enabled,
  });
