import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { TechnicianSkill } from "./technicianSkillSet.types";

export const getTechnicianSkillSet = async (): Promise<TechnicianSkill[]> => {
  const { data, error } = await supabase.from("technician_skill_set").select(
    `
        brand_group_id, 
        commercial,
        id,
        specific_issue_id,
        technician_id,
        unit_id
        `,
  );

  if (error) throw error;

  return data ?? [];
};
