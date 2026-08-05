import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  SpecificIssue,
  SpecificIssueInsert,
  SpecificIssueStatus,
  SpecificIssueUpdate,
} from "./specific-issue.types";

const SPECIFIC_ISSUE_SELECT = `
  active,
  active_before_archive,
  archived_at,
  archived_by,
  id,
  name,
  slug,
  unit_id
`;

const SPECIFIC_ISSUE_LIST_SELECT = `
  ${SPECIFIC_ISSUE_SELECT},
  parent_unit:unit!specific_issue_unit_id_fkey!inner (
    active,
    archived_at
  )
`;

export const getSpecificIssues = async (
  status: SpecificIssueStatus = "active",
): Promise<SpecificIssue[]> => {
  let query = supabase.from("specific_issue").select(SPECIFIC_ISSUE_LIST_SELECT);

  if (status === "active") {
    query = query
      .eq("active", true)
      .is("archived_at", null)
      .eq("parent_unit.active", true)
      .is("parent_unit.archived_at", null);
  } else if (status === "all") {
    query = query
      .is("archived_at", null)
      .is("parent_unit.archived_at", null);
  } else {
    query = query
      .not("archived_at", "is", null)
      .is("parent_unit.archived_at", null);
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
      id,
      name,
      slug,
      unit_id,
    }) => ({
      active,
      active_before_archive,
      archived_at,
      archived_by,
      id,
      name,
      slug,
      unit_id,
    }),
  );
};

export const getSpecificIssueById = async (
  id: string,
): Promise<SpecificIssue | null> => {
  const { data, error } = await supabase
    .from("specific_issue")
    .select(
      `${SPECIFIC_ISSUE_SELECT}, parent_unit:unit!specific_issue_unit_id_fkey!inner (archived_at)`,
    )
    .eq("id", id)
    .is("archived_at", null)
    .is("parent_unit.archived_at", null)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    active: data.active,
    active_before_archive: data.active_before_archive,
    archived_at: data.archived_at,
    archived_by: data.archived_by,
    id: data.id,
    name: data.name,
    slug: data.slug,
    unit_id: data.unit_id,
  };
};

export const createSpecificIssue = async (
  input: SpecificIssueInsert,
): Promise<SpecificIssue> => {
  const { data, error } = await supabase
    .from("specific_issue")
    .insert(input)
    .select(SPECIFIC_ISSUE_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Specific issue creation returned no row");

  return data;
};

export const updateSpecificIssue = async (
  id: string,
  patch: SpecificIssueUpdate,
): Promise<SpecificIssue> => {
  const { data, error } = await supabase
    .from("specific_issue")
    .update(patch)
    .eq("id", id)
    .is("archived_at", null)
    .select(SPECIFIC_ISSUE_SELECT)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Specific issue update returned no row");

  return data;
};

export const archiveSpecificIssue = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_specific_issue", {
    p_specific_issue_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Specific issue archive returned no id");

  return data;
};

export const restoreSpecificIssue = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_specific_issue", {
    p_specific_issue_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Specific issue restore returned no id");

  return data;
};

export const purgeSpecificIssue = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_specific_issue", {
    p_specific_issue_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("Specific issue purge returned no id");

  return data;
};
