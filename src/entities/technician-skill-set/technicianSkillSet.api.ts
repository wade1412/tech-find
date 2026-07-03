import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  NewSkillInput,
  TechnicianSkill,
} from "./technicianSkillSet.types";

const TECHNICIAN_SKILL_SET_SELECT = `
        brand_group_id, 
        commercial,
        id,
        specific_issue_id,
        technician_id,
        unit_id
        `;

export const getTechnicianSkillSet = async (): Promise<TechnicianSkill[]> => {
  const { data, error } = await supabase
    .from("technician_skill_set")
    .select(TECHNICIAN_SKILL_SET_SELECT);

  if (error) throw error;

  return data ?? [];
};

type updateTechnicianSkillsArg = {
  technicianId: string;
  addedSkills: NewSkillInput[];
  removedSkillIds: string[];
};

export const updateTechnicianSkills = async ({
  technicianId,
  addedSkills,
  removedSkillIds,
}: updateTechnicianSkillsArg): Promise<void> => {
  const { error } = await supabase.rpc("update_technician_skills", {
    p_technician_id: technicianId,
    p_added_skills: addedSkills,
    p_removed_skill_ids: removedSkillIds,
  });

  if (error) throw error;
};
