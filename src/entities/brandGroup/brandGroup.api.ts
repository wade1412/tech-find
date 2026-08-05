import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  BrandGroup,
  BrandGroupInsert,
  BrandGroupStatus,
  BrandGroupUpdate,
} from "./brandGroup.types";

const BRAND_GROUP_SELECT = `
  id,
  name,
  slug,
  display_order,
  active,
  active_before_archive,
  archived_at,
  archived_by
`;

export const getBrandGroups = async (
  status: BrandGroupStatus = "active",
): Promise<BrandGroup[]> => {
  let query = supabase.from("brand_group").select(BRAND_GROUP_SELECT);

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

export const getBrandGroupById = async (
  id: string,
): Promise<BrandGroup | null> => {
  const { data, error } = await supabase
    .from("brand_group")
    .select(BRAND_GROUP_SELECT)
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createBrandGroup = async (
  input: BrandGroupInsert,
): Promise<BrandGroup> => {
  const { data, error } = await supabase
    .from("brand_group")
    .insert(input)
    .select(BRAND_GROUP_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Brand group creation returned no row");

  return data;
};

export const updateBrandGroup = async (
  id: string,
  patch: BrandGroupUpdate,
): Promise<BrandGroup> => {
  const { data, error } = await supabase
    .from("brand_group")
    .update(patch)
    .eq("id", id)
    .is("archived_at", null)
    .select(BRAND_GROUP_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Brand group update returned no row");

  return data;
};

export const archiveBrandGroup = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_brand_group", {
    p_brand_group_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Brand group archive returned no id");

  return data;
};

export const restoreBrandGroup = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_brand_group", {
    p_brand_group_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Brand group restore returned no id");

  return data;
};

export const purgeBrandGroup = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_brand_group", {
    p_brand_group_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Brand group purge returned no id");

  return data;
};
