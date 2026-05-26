import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { TechnicianIgnoreList } from "./technicianIgnoreList.types";

export const getTechnicianIgnoreList = async (): Promise<
  TechnicianIgnoreList[]
> => {
  const { data, error } = await supabase.from("technician_ignore_list").select(
    `
        brand_id,
        id,
        specific_issue_id, 
        specificIssue_id, 
        technician_id,
        unit_id
        `,
  );

  if (error) throw error;

  return data ?? [];
};
