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

export const addTechnicianServiceZones = async (
  technicianId: string,
  addedIds: readonly string[],
): Promise<void> => {
  if (addedIds.length === 0) return;

  const { error } = await supabase.from("technician_service_zone").insert(
    addedIds.map((zoneId) => ({
      technician_id: technicianId,
      zone_id: zoneId,
    })),
  );

  if (error) throw error;
};

export const deleteTechnicianServiceZones = async (
  technicianId: string,
  removedIds: readonly string[],
): Promise<void> => {
  if (removedIds.length === 0) return;

  const { error } = await supabase
    .from("technician_service_zone")
    .delete()
    .eq("technician_id", technicianId)
    .in("zone_id", removedIds);

  if (error) throw error;
};
