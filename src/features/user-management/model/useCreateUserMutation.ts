import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../../entities/user/user.types";
import { queryKeys } from "../../../shared/api/queryKeys";
import { createUser } from "../api/createUser.api";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (createdUser) => {
      queryClient.setQueryData<User[]>(
        [...queryKeys.users, "all"],
        (users = []) =>
          [...users, createdUser].sort((left, right) =>
            left.alias.localeCompare(right.alias),
          ),
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  });
}
