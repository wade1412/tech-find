import { useQuery } from "@tanstack/react-query";
import { getTechnicianSkillSet } from "./technicianSkillSet.api";
import { queryKeys } from "../../shared/api/queryKeys";

export const useTechnicianSkillSetQuery = () => {
  return useQuery({
    queryKey: queryKeys.technicianSkillSet,
    queryFn: getTechnicianSkillSet,
  });
};
