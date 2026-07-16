import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { Technician, TechnicianUpdate } from "./technician.types";

const TECHNICIAN_SELECT = `id,
        active,
        active_before_archive,
        name,
        alias,
        notes,
        jobs_per_day,
        home_zip_code,
        gas,
        commercial,
        can_service_built_in,
        can_service_stacked_washer,
        can_service_stacked_dryer,
        archived_at,
        archived_by`;

export const getActiveTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from("technician")
    .select(TECHNICIAN_SELECT)
    .eq("active", true)
    .is("archived_at", null)
    .order("alias");

  if (error) throw error;

  return data ?? [];
};

export const getAllTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from("technician")
    .select(TECHNICIAN_SELECT)
    .is("archived_at", null)
    .order("alias");

  if (error) throw error;

  return data ?? [];
};

export const getArchivedTechnicians = async (): Promise<Technician[]> => {
  const { data, error } = await supabase
    .from("technician")
    .select(TECHNICIAN_SELECT)
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const updateTechnician = async (
  id: string,
  newFieldValues: TechnicianUpdate,
): Promise<Technician> => {
  const { data, error } = await supabase
    .from("technician")
    .update(newFieldValues)
    .eq("id", id)
    .select(TECHNICIAN_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Technician update returned no row");

  return data;
};

export const archiveTechnician = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_technician", {
    p_technician_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Technician archive returned no id");

  return data;
};

export const restoreTechnician = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_technician", {
    p_technician_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Technician restore returned no id");

  return data;
};

export const purgeTechnician = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_technician", {
    p_technician_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Technician purge returned no id");

  return data;
};
