import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { Technician } from "./technician.types";

export const getTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from("technician")
    .select(
      `id,
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
        can_service_stacked_dryer`,
    )
    .eq("active", true)
    .order("alias");

  if (error) throw error;

  return data ?? [];
};
