import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveSpecificIssue,
  purgeSpecificIssue,
  restoreSpecificIssue,
} from "../../../../entities/specific-issue/specific-issue.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

const useInvalidateSpecificIssueQueries = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: ["specific-issues"] });
};

export const useArchiveSpecificIssueMutation = () => {
  const invalidateSpecificIssues = useInvalidateSpecificIssueQueries();

  return useMutation({
    mutationFn: archiveSpecificIssue,
    onSuccess: invalidateSpecificIssues,
  });
};

export const useRestoreSpecificIssueMutation = () => {
  const invalidateSpecificIssues = useInvalidateSpecificIssueQueries();

  return useMutation({
    mutationFn: restoreSpecificIssue,
    onSuccess: invalidateSpecificIssues,
  });
};

export const usePurgeSpecificIssueMutation = () => {
  const queryClient = useQueryClient();
  const invalidateSpecificIssues = useInvalidateSpecificIssueQueries();

  return useMutation({
    mutationFn: purgeSpecificIssue,
    onSuccess: (purgedId) =>
      Promise.all([
        invalidateSpecificIssues(),
        queryClient.removeQueries({
          queryKey: queryKeys.specificIssues.detail(purgedId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianSkillSet,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianIgnoreList,
        }),
      ]),
  });
};
