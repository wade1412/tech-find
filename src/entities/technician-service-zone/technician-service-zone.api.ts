import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { TechnicianServiceZone } from "./technician-service-zone.types";

const TECHNICIAN_SERVICE_ZONES_SELECT = `
         technician_id,
        zone_id
        `;

export const getTechnicianServiceZones = async (): Promise<
  TechnicianServiceZone[]
> => {
  const { data, error } = await supabase
    .from("technician_service_zone")
    .select(TECHNICIAN_SERVICE_ZONES_SELECT);

  if (error) throw error;

  return data ?? [];
};

type UpdateTechnicianServiceZonesArg = {
  technicianId: string;
  addedIds: string[];
  removedIds: string[];
};

export const updateTechnicianServiceZonesApi = async ({
  technicianId,
  addedIds,
  removedIds,
}: UpdateTechnicianServiceZonesArg): Promise<TechnicianServiceZone[]> => {
  const { data, error } = await supabase.rpc("update_technician_service_zones", {
    p_technician_id: technicianId,
    p_added_zone_ids: addedIds,
    p_removed_zone_ids: removedIds,
  });

  if (error) throw error;

  return data ?? [];
};
