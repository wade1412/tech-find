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
    .select(UNIT_SELECT)
    .order("display_order")
    .order("name");

  if (status === "active") {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
};

export const getUnitById = async (id: string): Promise<Unit | null> => {
  const { data, error } = await supabase
    .from("unit")
    .select(UNIT_SELECT)
    .eq("id", id)
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
    .select(UNIT_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unit update returned no row");

  return data;
};
