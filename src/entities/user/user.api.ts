import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { User } from "./user.types";

const USER_SELECT = `active,
    active_before_archive,
    alias,
    archived_at,
    archived_by,
    created_at,
    email,
    full_name,
    id,
    role,
    updated_at`;

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select(USER_SELECT)
    .is("archived_at", null)
    .order("alias", { ascending: true });

  if (error) throw error;

  return data ?? [];
};

export const getArchivedUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select(USER_SELECT)
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const archiveUser = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("archive_user", {
    p_user_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("User archive returned no id");

  return data;
};

export const restoreUser = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("restore_user", {
    p_user_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("User restore returned no id");

  return data;
};

export const purgeUser = async (id: string): Promise<string> => {
  const { data, error } = await supabase.rpc("purge_user", {
    p_user_id: id,
  });

  if (error) throw error;
  if (!data) throw new Error("User purge returned no id");

  return data;
};
