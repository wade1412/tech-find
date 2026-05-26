import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { SpecificIssue } from "./specific-issue.types";

export const getSpecificIssues = async (): Promise<SpecificIssue[]> => {
  const { data, error } = await supabase
    .from("specific_issue")
    .select(
      `active,
        id,
        name,
        slug,
        unit_id
    `,
    )
    .eq("active", true)
    .order("name");

  if (error) throw error;

  return data ?? [];
};
