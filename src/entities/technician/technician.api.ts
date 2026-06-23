import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { Technician } from "./technician.types";

const TECHNICIAN_SELECT = `id,
        active,
        name,
        alias,
        notes,
        service_area,
        jobs_per_day,
        home_zip_code,
        gas,
        commercial,
        can_service_built_in,
        can_service_stacked_washer,
        can_service_stacked_dryer`;

export const getActiveTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from("technician")
    .select(TECHNICIAN_SELECT)
    .eq("active", true)
    .order("alias");

  if (error) throw error;

  return data ?? [];
};

export const getAllTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from("technician")
    .select(TECHNICIAN_SELECT)
    .order("alias");

  if (error) throw error;

  return data ?? [];
};
