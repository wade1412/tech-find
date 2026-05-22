import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { BrandGroup } from "./brandGroup.types";

export const getBrandGroups = async (): Promise<BrandGroup[]> => {
  const { data, error } = await supabase
    .from("brand_group")
    .select(
      `
         active,
          display_order,
          id,
          name,
          slug`,
    )
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data ?? [];
};
