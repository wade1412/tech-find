import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../../../entities/user/user.types";
import { queryKeys } from "../../../shared/api/queryKeys";
import { updateUser } from "../api/updateUser.api";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>(queryKeys.users, (users) =>
        users
          ?.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          )
          .sort((left, right) => left.alias.localeCompare(right.alias)),
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  });
}
