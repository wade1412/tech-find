import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getTechnicianIgnoreList } from "./technicianIgnoreList.api";

export const useTechnicianIgnoreListQuery = () => {
  return useQuery({
    queryKey: queryKeys.technicianIgnoreList,
    queryFn: getTechnicianIgnoreList,
  });
};
