import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSpecificIssue,
  updateSpecificIssue,
} from "../../../../entities/specific-issue/specific-issue.api";
import type {
  SpecificIssueInsert,
  SpecificIssueUpdate,
} from "../../../../entities/specific-issue/specific-issue.types";
import { queryKeys } from "../../../../shared/api/queryKeys";

interface UpdateSpecificIssueVariables {
  id: string;
  patch: SpecificIssueUpdate;
}

const invalidateSpecificIssues = (
  queryClient: ReturnType<typeof useQueryClient>,
) => queryClient.invalidateQueries({ queryKey: ["specific-issues"] });

export const useCreateSpecificIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SpecificIssueInsert) => createSpecificIssue(input),
    onSuccess: (specificIssue) => {
      queryClient.setQueryData(
        queryKeys.specificIssues.detail(specificIssue.id),
        specificIssue,
      );
      return invalidateSpecificIssues(queryClient);
    },
  });
};

export const useUpdateSpecificIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateSpecificIssueVariables) =>
      updateSpecificIssue(id, patch),
    onSuccess: (specificIssue) => {
      queryClient.setQueryData(
        queryKeys.specificIssues.detail(specificIssue.id),
        specificIssue,
      );
      return invalidateSpecificIssues(queryClient);
    },
  });
};
