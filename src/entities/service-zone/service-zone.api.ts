import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { ServiceZone } from "./service-zone.types";

export const getServiceZones = async (): Promise<ServiceZone[]> => {
  const { data, error } = await supabase
    .from("service_zone")
    .select(
      `
             active,
            display_order,
            id,
            name,
            slug
        `,
    )
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data ?? [];
};
