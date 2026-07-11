import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  NewIgnoreItemInput,
  TechnicianIgnoreList,
} from "./technicianIgnoreList.types";

export const getTechnicianIgnoreList = async (): Promise<
  TechnicianIgnoreList[]
> => {
  const { data, error } = await supabase.from("technician_ignore_list").select(
    `
        brand_id,
        id,
        specific_issue_id, 
        technician_id,
        unit_id
        `,
  );

  if (error) throw error;

  return data ?? [];
};

type UpdateTechnicianIgnoreListArg = {
  technicianId: string;
  addedItems: NewIgnoreItemInput[];
  removedItemIds: string[];
};

export const updateTechnicianIgnoreListApi = async ({
  technicianId,
  addedItems,
  removedItemIds,
}: UpdateTechnicianIgnoreListArg): Promise<TechnicianIgnoreList[]> => {
  const { data, error } = await supabase.rpc("update_technician_ignore_list", {
    p_technician_id: technicianId,
    p_added_items: addedItems,
    p_removed_item_ids: removedItemIds,
  });

  if (error) throw error;

  return data ?? [];
};
