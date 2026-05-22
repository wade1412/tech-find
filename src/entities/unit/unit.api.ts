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
        display_order,
        active,
        is_built_in,
        can_be_stacked,
        can_be_commercial
        `,
    )
    .eq("active", true)
    .order("display_order");

  if (error) throw error;

  return data ?? [];
};
