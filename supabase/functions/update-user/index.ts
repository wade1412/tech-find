import { createClient, type AdminUserAttributes } from "npm:@supabase/supabase-js@2.106.1";
import { corsHeaders } from "../_shared/cors.ts";

const APP_ROLES = ["user", "secondary_admin", "main_admin", "owner"] as const;
type AppRole = (typeof APP_ROLES)[number];

interface UserProfile {
  active: boolean;
  alias: string;
  created_at: string;
  email: string;
  full_name: string;
  id: string;
  role: AppRole;
  updated_at: string;
}

interface UpdateUserPayload {
  active: boolean;
  alias: string;
  email: string;
  expectedUpdatedAt: string;
  full_name: string;
  role: AppRole;
  userId: string;
}

const ROLE_LEVEL: Record<AppRole, number> = {
  user: 0,
  secondary_admin: 1,
  main_admin: 2,
  owner: 3,
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

function parsePayload(value: unknown): UpdateUserPayload | null {
  if (!value || typeof value !== "object") return null;

  const payload = value as Record<string, unknown>;
  if (
    typeof payload.userId !== "string" ||
    !UUID_PATTERN.test(payload.userId) ||
    typeof payload.expectedUpdatedAt !== "string" ||
    Number.isNaN(Date.parse(payload.expectedUpdatedAt)) ||
    typeof payload.active !== "boolean" ||
    typeof payload.alias !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.full_name !== "string" ||
    !isAppRole(payload.role)
  ) {
    return null;
  }

  const alias = payload.alias.trim();
  const email = payload.email.trim().toLowerCase();
  const fullName = payload.full_name.trim();

  if (
    !alias ||
    alias.length > 64 ||
    !fullName ||
    fullName.length > 120 ||
    !email ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return null;
  }

  return {
    active: payload.active,
    alias,
    email,
    expectedUpdatedAt: payload.expectedUpdatedAt,
    full_name: fullName,
    role: payload.role,
    userId: payload.userId,
  };
}

function canEditTarget(
  actor: UserProfile,
  target: UserProfile,
  update: UpdateUserPayload,
): string | null {
  if (!actor.active || ROLE_LEVEL[actor.role] < ROLE_LEVEL.main_admin) {
    return "You do not have permission to edit users.";
  }

  const isSelf = actor.id === target.id;
  const accessChanged =
    update.active !== target.active || update.role !== target.role;

  if (isSelf && accessChanged) {
    return "You cannot change your own role or status.";
  }

  if (actor.role === "owner") return null;

  if (!isSelf && ROLE_LEVEL[target.role] >= ROLE_LEVEL[actor.role]) {
    return "Main admins cannot edit another main admin or an owner.";
  }

  if (
    update.role !== target.role &&
    !(["user", "secondary_admin"] as AppRole[]).includes(update.role)
  ) {
    return "Main admins can only assign User or Secondary Admin roles.";
  }

  return null;
}

function isConflictError(message: string, code?: string): boolean {
  const normalized = message.toLowerCase();
  return (
    code === "23505" ||
    normalized.includes("already") ||
    normalized.includes("duplicate") ||
    normalized.includes("registered") ||
    normalized.includes("unique")
  );
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { message: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const adminKey =
    Deno.env.get("SUPABASE_SECRET_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization");

  if (!supabaseUrl || !adminKey) {
    console.error("Missing Supabase server environment variables");
    return jsonResponse(500, { message: "Server configuration error" });
  }

  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse(401, { message: "Authentication required" });
  }

  const admin = createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const token = authorization.slice("Bearer ".length);
  const { data: authData, error: authError } = await admin.auth.getUser(token);

  if (authError || !authData.user) {
    return jsonResponse(401, { message: "Invalid or expired session" });
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return jsonResponse(400, { message: "Request body must be valid JSON" });
  }

  const update = parsePayload(requestBody);
  if (!update) {
    return jsonResponse(400, { message: "Invalid user data" });
  }

  const [{ data: actor, error: actorError }, { data: target, error: targetError }] =
    await Promise.all([
      admin.from("user_profile").select("*").eq("id", authData.user.id).single(),
      admin.from("user_profile").select("*").eq("id", update.userId).single(),
    ]);

  if (actorError || !actor) {
    return jsonResponse(403, { message: "Active admin profile required" });
  }

  if (targetError || !target) {
    return jsonResponse(404, { message: "User not found" });
  }

  const actorProfile = actor as UserProfile;
  const targetProfile = target as UserProfile;

  if (actorProfile.role !== "owner" && targetProfile.role === "owner") {
    return jsonResponse(404, { message: "User not found" });
  }

  const permissionError = canEditTarget(actorProfile, targetProfile, update);
  if (permissionError) {
    return jsonResponse(403, { message: permissionError });
  }

  const writeAudit = async ({
    afterState = null,
    errorMessage = null,
    outcome,
    requiresReconciliation = false,
  }: {
    afterState?: UserProfile | null;
    errorMessage?: string | null;
    outcome: "succeeded" | "failed" | "conflict";
    requiresReconciliation?: boolean;
  }) => {
    const { error } = await admin.from("user_management_audit").insert({
      actor_id: actorProfile.id,
      target_user_id: targetProfile.id,
      operation: "update",
      outcome,
      before_state: targetProfile,
      after_state: afterState,
      error_message: errorMessage,
      requires_reconciliation: requiresReconciliation,
    });

    if (error) {
      console.error("Failed to write user update audit", error);
    }
  };

  if (targetProfile.updated_at !== update.expectedUpdatedAt) {
    await writeAudit({
      outcome: "conflict",
      errorMessage: "The supplied profile version is stale.",
    });
    return jsonResponse(409, {
      message:
        "This user was changed by another administrator. Discard your changes to load the latest version.",
    });
  }

  const { data: updatedProfileData, error: profileError } = await admin
    .from("user_profile")
    .update({
      active: update.active,
      alias: update.alias,
      email: update.email,
      full_name: update.full_name,
      role: update.role,
    })
    .eq("id", update.userId)
    .eq("updated_at", update.expectedUpdatedAt)
    .select("*")
    .maybeSingle();

  if (profileError || !updatedProfileData) {
    if (!profileError) {
      await writeAudit({
        outcome: "conflict",
        errorMessage: "The profile changed during the update.",
      });
      return jsonResponse(409, {
        message:
          "This user was changed by another administrator. Discard your changes to load the latest version.",
      });
    }

    const conflict = isConflictError(profileError.message, profileError.code);
    await writeAudit({
      outcome: "failed",
      errorMessage: profileError.message,
    });
    return jsonResponse(conflict ? 409 : 500, {
      message: conflict
        ? "A user with this email already exists."
        : "Failed to update user profile.",
    });
  }

  const updatedProfile = updatedProfileData as UserProfile;
  const emailChanged = update.email !== targetProfile.email.toLowerCase();
  const statusChanged = update.active !== targetProfile.active;
  const authPatch: AdminUserAttributes = {};

  if (emailChanged) {
    authPatch.email = update.email;
    authPatch.email_confirm = true;
  }
  if (statusChanged) {
    authPatch.ban_duration = update.active ? "none" : "876000h";
  }

  if (emailChanged || statusChanged) {
    const { error } = await admin.auth.admin.updateUserById(
      update.userId,
      authPatch,
    );

    if (error) {
      const { data: rolledBackProfile, error: rollbackError } = await admin
        .from("user_profile")
        .update({
          active: targetProfile.active,
          alias: targetProfile.alias,
          email: targetProfile.email,
          full_name: targetProfile.full_name,
          role: targetProfile.role,
        })
        .eq("id", targetProfile.id)
        .eq("updated_at", updatedProfile.updated_at)
        .select("id")
        .maybeSingle();
      const requiresReconciliation = Boolean(
        rollbackError || !rolledBackProfile,
      );

      if (requiresReconciliation) {
        console.error("Failed to roll back user profile after Auth error", {
          authError: error,
          rollbackError,
          userId: targetProfile.id,
        });
      }

      await writeAudit({
        afterState: updatedProfile,
        outcome: "failed",
        errorMessage: error.message,
        requiresReconciliation,
      });

      return jsonResponse(isConflictError(error.message) ? 409 : 400, {
        message: isConflictError(error.message)
          ? "A user with this email already exists."
          : "Failed to update the user's authentication account.",
      });
    }
  }

  await writeAudit({
    afterState: updatedProfile,
    outcome: "succeeded",
  });

  return jsonResponse(200, { user: updatedProfile });
});
