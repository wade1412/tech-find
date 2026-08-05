import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  Brand,
  BrandInsert,
  BrandStatus,
  BrandUpdate,
} from "./brand.types";

const BRAND_SELECT = `
  id,
  name,
  slug,
  group_id,
  active,
  active_before_archive,
  archived_at,
  archived_by,
  archived_via_group_id
`;

const BRAND_LIST_SELECT = `
  ${BRAND_SELECT},
  parent_group:brand_group!brand_groupId_fkey!inner (
    active,
    archived_at
  )
`;

export const getBrands = async (
  status: BrandStatus = "active",
): Promise<Brand[]> => {
  let query = supabase.from("brand").select(BRAND_LIST_SELECT);

  if (status === "active") {
    query = query
      .eq("active", true)
      .is("archived_at", null)
      .eq("parent_group.active", true)
      .is("parent_group.archived_at", null);
  } else if (status === "all") {
    query = query.is("archived_at", null);
  } else {
    query = query.not("archived_at", "is", null);
  }

  const { data, error } =
    status === "archived"
      ? await query.order("archived_at", { ascending: false })
      : await query.order("name");

  if (error) throw error;

  return (data ?? []).map(
    ({
      active,
      active_before_archive,
      archived_at,
      archived_by,
      archived_via_group_id,
      group_id,
      id,
      name,
      slug,
    }) => ({
      active,
      active_before_archive,
      archived_at,
      archived_by,
      archived_via_group_id,
      group_id,
      id,
      name,
      slug,
    }),
  );
};

export const getBrandById = async (id: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from("brand")
    .select(BRAND_SELECT)
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const createBrand = async (input: BrandInsert): Promise<Brand> => {
  const { data, error } = await supabase
    .from("brand")
    .insert(input)
    .select(BRAND_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Brand creation returned no row");

  return data;
};

export const updateBrand = async (
  id: string,
  patch: BrandUpdate,
): Promise<Brand> => {
  const { data, error } = await supabase
    .from("brand")
    .update(patch)
    .eq("id", id)
    .is("archived_at", null)
    .select(BRAND_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Brand update returned no row");

  return data;
};

export const archiveBrand = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_brand", {
    p_brand_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Brand archive returned no id");

  return data;
};

export const restoreBrand = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_brand", {
    p_brand_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Brand restore returned no id");

  return data;
};

export const purgeBrand = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_brand", {
    p_brand_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Brand purge returned no id");

  return data;
};
