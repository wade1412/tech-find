import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { Technician, TechnicianUpdate } from "./technician.types";

const TECHNICIAN_SELECT = `id,
        active,
        name,
        alias,
        notes,
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

export const deleteTechnician = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("delete_technician", {
    p_technician_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Technician deletion returned no id");

  return data;
};
