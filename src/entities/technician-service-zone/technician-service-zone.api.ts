import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { TechnicianServiceZone } from "./technician-service-zone.types";

export const getTechnicianServiceZones = async (): Promise<
  TechnicianServiceZone[]
> => {
  const { data, error } = await supabase.from("technician_service_zone")
    .select(`
         technician_id,
        zone_id
        `);

  if (error) throw error;

  return data ?? [];
};
