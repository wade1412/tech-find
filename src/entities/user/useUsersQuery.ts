import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getAllUsers, getArchivedUsers } from "./user.api";

type UserQueryStatus = "all" | "archived";

export const useUsersQuery = (
  status: UserQueryStatus = "all",
  enabled = true,
) => {
  return useQuery({
    queryKey: [...queryKeys.users, status],
    queryFn: () => {
      if (status === "archived") return getArchivedUsers();
      return getAllUsers();
    },
    enabled,
  });
};
