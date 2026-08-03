import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  ServiceZone,
  ServiceZoneInsert,
  ServiceZoneStatus,
  ServiceZoneUpdate,
} from "./service-zone.types";

const SERVICE_ZONE_SELECT = `
  active,
  active_before_archive,
  archived_at,
  archived_by,
  display_order,
  id,
  name,
  slug
`;

export const getServiceZones = async (
  status: ServiceZoneStatus = "active",
): Promise<ServiceZone[]> => {
  let query = supabase.from("service_zone").select(SERVICE_ZONE_SELECT);

  if (status === "active") {
    query = query.eq("active", true).is("archived_at", null);
  } else if (status === "all") {
    query = query.is("archived_at", null);
  } else {
    query = query.not("archived_at", "is", null);
  }

  const { data, error } =
    status === "archived"
      ? await query.order("archived_at", { ascending: false })
      : await query.order("display_order").order("name");

  if (error) throw error;

  return data ?? [];
};

export const getServiceZoneById = async (
  id: string,
): Promise<ServiceZone | null> => {
  const { data, error } = await supabase
    .from("service_zone")
    .select(SERVICE_ZONE_SELECT)
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createServiceZone = async (
  input: ServiceZoneInsert,
): Promise<ServiceZone> => {
  const { data, error } = await supabase
    .from("service_zone")
    .insert(input)
    .select(SERVICE_ZONE_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Service zone creation returned no row");

  return data;
};

export const updateServiceZone = async (
  id: string,
  patch: ServiceZoneUpdate,
): Promise<ServiceZone> => {
  const { data, error } = await supabase
    .from("service_zone")
    .update(patch)
    .eq("id", id)
    .is("archived_at", null)
    .select(SERVICE_ZONE_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Service zone update returned no row");

  return data;
};

export const archiveServiceZone = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_service_zone", {
    p_service_zone_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Service zone archive returned no id");

  return data;
};

export const restoreServiceZone = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_service_zone", {
    p_service_zone_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Service zone restore returned no id");

  return data;
};

export const purgeServiceZone = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_service_zone", {
    p_service_zone_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Service zone purge returned no id");

  return data;
};
