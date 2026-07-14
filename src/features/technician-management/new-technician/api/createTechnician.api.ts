import type { Technician } from "../../../../entities/technician/technician.types";
import { supabase } from "../../../../shared/api/supabase/supabaseClient";
import type { CreateTechnicianInput } from "../model/newTechnician.types";

export const createTechnician = async (
  input: CreateTechnicianInput,
): Promise<Technician> => {
  const { data, error } = await supabase.rpc("create_technician", {
    p_profile: input.profile,
    p_zone_ids: input.zoneIds,
    p_skills: input.skills,
    p_ignore_items: input.ignoreItems,
  });

  if (error) throw error;
  if (!data) throw new Error("Technician creation returned no row");

  return data;
};
