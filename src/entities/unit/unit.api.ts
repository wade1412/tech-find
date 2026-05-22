import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { Unit } from "./unit.types";

export const getUnits = async (): Promise<Unit[]> => {
  const { data, error } = await supabase
    .from("unit")
    .select(
      `
        id,
        name,
        slug,
        active,
        is_built_in,
        can_be_stacked,
        can_be_commercial
        `,
    )
    .eq("active", true)
    .order("name");

  if (error) throw error;

  return data || [];
};
