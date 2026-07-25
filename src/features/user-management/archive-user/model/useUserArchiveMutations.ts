import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveUser,
  purgeUser,
  restoreUser,
} from "../../../../entities/user/user.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

const useInvalidateUserQuery = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: queryKeys.users });
};

export const useArchiveUserMutation = () => {
  const invalidateUsers = useInvalidateUserQuery();

  return useMutation({
    mutationFn: archiveUser,
    onSuccess: invalidateUsers,
  });
};

export const useRestoreUserMutation = () => {
  const invalidateUsers = useInvalidateUserQuery();

  return useMutation({
    mutationFn: restoreUser,
    onSuccess: invalidateUsers,
  });
};

export const usePurgeUserMutation = () => {
  const invalidateUsers = useInvalidateUserQuery();

  return useMutation({
    mutationFn: purgeUser,
    onSuccess: invalidateUsers,
  });
};
