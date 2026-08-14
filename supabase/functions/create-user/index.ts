import { createClient } from "npm:@supabase/supabase-js@2.106.1";
import { getCorsHeaders } from "../_shared/cors.ts";

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

interface CreateUserPayload {
  active: true;
  alias: string;
  email: string;
  full_name: string;
  redirectTo: string;
  role: AppRole;
}

const ROLE_LEVEL: Record<AppRole, number> = {
  user: 0,
  secondary_admin: 1,
  main_admin: 2,
  owner: 3,
};
const DEFAULT_ALLOWED_REDIRECT_ORIGINS = [
  "http://localhost:5173",
  "https://tech-find.vercel.app",
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAllowedRedirectOrigins(): Set<string> {
  const configuredOrigins =
    Deno.env.get("ALLOWED_REDIRECT_ORIGINS")
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  return new Set([
    ...DEFAULT_ALLOWED_REDIRECT_ORIGINS,
    ...configuredOrigins,
  ]);
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  corsHeaders: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

function parsePayload(value: unknown): CreateUserPayload | null {
  if (!value || typeof value !== "object") return null;

  const payload = value as Record<string, unknown>;
  if (
    payload.active !== true ||
    typeof payload.alias !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.full_name !== "string" ||
    typeof payload.redirectTo !== "string" ||
    !isAppRole(payload.role)
  ) {
    return null;
  }

  const alias = payload.alias.trim();
  const email = payload.email.trim().toLowerCase();
  const fullName = payload.full_name.trim();

  let redirectUrl: URL;
  try {
    redirectUrl = new URL(payload.redirectTo);
  } catch {
    return null;
  }

  if (
    !["http:", "https:"].includes(redirectUrl.protocol) ||
    !getAllowedRedirectOrigins().has(redirectUrl.origin) ||
    redirectUrl.pathname !== "/secure-email-link" ||
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
    active: true,
    alias,
    email,
    full_name: fullName,
    redirectTo: redirectUrl.toString(),
    role: payload.role,
  };
}

function canCreateRole(actor: UserProfile, role: AppRole): boolean {
  if (!actor.active || ROLE_LEVEL[actor.role] < ROLE_LEVEL.main_admin) {
    return false;
  }

  if (actor.role === "owner") return true;
  return role === "user" || role === "secondary_admin";
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

function getInviteFailure(
  message: string,
  code?: string,
): { message: string; status: number } {
  const normalized = message.toLowerCase();

  if (
    code === "over_email_send_rate_limit" ||
    normalized.includes("rate limit") ||
    normalized.includes("too many requests")
  ) {
    return {
      status: 429,
      message:
        "The authentication email limit has been reached. Wait and try again, or configure custom SMTP in Supabase.",
    };
  }

  if (
    code === "email_address_not_authorized" ||
    normalized.includes("email address not authorized")
  ) {
    return {
      status: 400,
      message:
        "Supabase cannot send invitations to this address until custom SMTP is configured.",
    };
  }

  if (isConflictError(message, code)) {
    return { status: 409, message: "A user with this email already exists." };
  }

  return { status: 400, message: "We could not send the user invitation." };
}

Deno.serve(async (request) => {
  const corsHeaders = getCorsHeaders(request);

  if (!corsHeaders) {
    return new Response(JSON.stringify({ message: "Origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const respond = (status: number, body: Record<string, unknown>) =>
    jsonResponse(status, body, corsHeaders);

  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return respond(405, { message: "Method not allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const adminKey =
    Deno.env.get("SUPABASE_SECRET_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization");

  if (!supabaseUrl || !adminKey) {
    console.error("Missing Supabase server environment variables");
    return respond(500, { message: "Server configuration error" });
  }

  if (!authorization?.startsWith("Bearer ")) {
    return respond(401, { message: "Authentication required" });
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
    return respond(401, { message: "Invalid or expired session" });
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return respond(400, { message: "Request body must be valid JSON" });
  }

  const input = parsePayload(requestBody);
  if (!input) {
    return respond(400, { message: "Invalid user data" });
  }

  const { data: actor, error: actorError } = await admin
    .from("user_profile")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (actorError || !actor) {
    return respond(403, { message: "Active admin profile required" });
  }

  const actorProfile = actor as UserProfile;
  if (!canCreateRole(actorProfile, input.role)) {
    return respond(403, {
      message:
        actorProfile.role === "owner"
          ? "You do not have permission to create users."
          : "Main admins can only create User or Secondary Admin accounts.",
    });
  }

  const writeAudit = async ({
    errorMessage = null,
    outcome,
    requiresReconciliation = false,
    targetUserId = null,
    user = null,
  }: {
    errorMessage?: string | null;
    outcome: "succeeded" | "failed";
    requiresReconciliation?: boolean;
    targetUserId?: string | null;
    user?: UserProfile | null;
  }) => {
    const { error } = await admin.from("user_management_audit").insert({
      actor_id: actorProfile.id,
      target_user_id: targetUserId,
      operation: "create",
      outcome,
      before_state: null,
      after_state: user,
      error_message: errorMessage,
      requires_reconciliation: requiresReconciliation,
    });

    if (error) {
      console.error("Failed to write user creation audit", error);
    }
  };

  const { data: inviteData, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(input.email, {
      data: {
        alias: input.alias,
        full_name: input.full_name,
      },
      redirectTo: input.redirectTo,
    });

  if (inviteError || !inviteData.user) {
    const message = inviteError?.message ?? "Failed to invite user";
    const failure = getInviteFailure(message, inviteError?.code);
    await writeAudit({ outcome: "failed", errorMessage: message });

    return respond(failure.status, { message: failure.message });
  }

  const invitedUserId = inviteData.user.id;
  const { data: createdProfile, error: profileError } = await admin
    .from("user_profile")
    .insert({
      active: true,
      alias: input.alias,
      email: input.email,
      full_name: input.full_name,
      id: invitedUserId,
      role: input.role,
    })
    .select("*")
    .single();

  if (profileError || !createdProfile) {
    const { error: rollbackError } =
      await admin.auth.admin.deleteUser(invitedUserId);
    const requiresReconciliation = Boolean(rollbackError);

    if (rollbackError) {
      console.error("Failed to roll back invited Auth user", rollbackError);
    }

    await writeAudit({
      outcome: "failed",
      targetUserId: invitedUserId,
      errorMessage:
        profileError?.message ?? "Failed to create user profile",
      requiresReconciliation,
    });

    return respond(
      isConflictError(profileError?.message ?? "", profileError?.code)
        ? 409
        : 500,
      {
        message: isConflictError(
          profileError?.message ?? "",
          profileError?.code,
        )
          ? "A user with this email already exists."
          : "Failed to create user profile.",
      },
    );
  }

  const user = createdProfile as UserProfile;
  await writeAudit({
    outcome: "succeeded",
    targetUserId: user.id,
    user,
  });

  return respond(201, { user });
});
