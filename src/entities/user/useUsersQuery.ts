import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getAllUsers } from "./user.api";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: getAllUsers,
  });
};
