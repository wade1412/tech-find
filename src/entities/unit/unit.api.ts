import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  Unit,
  UnitInsert,
  UnitStatus,
  UnitUpdate,
} from "./unit.types";

const UNIT_SELECT = `
  id,
  name,
  slug,
  display_order,
  active,
  active_before_archive,
  archived_at,
  archived_by,
  is_built_in,
  can_be_stacked,
  can_be_gas,
  can_be_commercial
`;

export const getUnits = async (
  status: UnitStatus = "active",
): Promise<Unit[]> => {
  let query = supabase
    .from("unit")
    .select(UNIT_SELECT);

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

export const getUnitById = async (id: string): Promise<Unit | null> => {
  const { data, error } = await supabase
    .from("unit")
    .select(UNIT_SELECT)
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createUnit = async (input: UnitInsert): Promise<Unit> => {
  const { data, error } = await supabase
    .from("unit")
    .insert(input)
    .select(UNIT_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unit creation returned no row");

  return data;
};

export const updateUnit = async (
  id: string,
  patch: UnitUpdate,
): Promise<Unit> => {
  const { data, error } = await supabase
    .from("unit")
    .update(patch)
    .eq("id", id)
    .is("archived_at", null)
    .select(UNIT_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unit update returned no row");

  return data;
};

export const archiveUnit = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_unit", {
    p_unit_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Unit archive returned no id");

  return data;
};

export const restoreUnit = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_unit", {
    p_unit_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Unit restore returned no id");

  return data;
};

export const purgeUnit = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_unit", {
    p_unit_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Unit purge returned no id");

  return data;
};
