import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { Brand } from "./brand.types";

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from("brand")
    .select(
      `
        active,
          group_id,
          id,
          name,
          slug
        `,
    )
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return data ?? [];
};
