import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

const fileEnv = loadEnv("e2e", process.cwd(), "");
const getEnv = (key) => process.env[key] ?? fileEnv[key];

const supabaseUrl = getEnv("E2E_SUPABASE_URL");
const serviceRoleKey = getEnv("E2E_SUPABASE_SERVICE_ROLE_KEY");
const email = getEnv("E2E_USER_EMAIL");
const password = getEnv("E2E_USER_PASSWORD");

if (!supabaseUrl || !serviceRoleKey || !email || !password) {
  throw new Error("Missing E2E environment variables");
}

// Exit early on not local instance of DB
const supabaseEndpoint = new URL(supabaseUrl);
const isLocalSupabase =
  ["127.0.0.1", "localhost"].includes(supabaseEndpoint.hostname) &&
  supabaseEndpoint.port === "54321";

if (!isLocalSupabase) {
  throw new Error(
    `Refusing to prepare E2E data outside local Supabase: ${supabaseEndpoint.origin}`,
  );
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const { error: staleZonesError } = await supabaseAdmin
  .from("service_zone")
  .delete()
  .like("slug", "e2e-zone-%");

if (staleZonesError) {
  throw staleZonesError;
}

// Check for E2E user, if exists - delete; create new E2E user
const { data: existingUsers, error: listUsersError } =
  await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

if (listUsersError) {
  throw listUsersError;
}

const fixtureEmails = new Set([
  email.toLowerCase(),
  // Remove fixtures created before the E2E role was changed from owner.
  "owner.e2e@techfind.test",
]);
const existingFixtureUsers = existingUsers.users.filter((candidate) =>
  fixtureEmails.has(candidate.email?.toLowerCase() ?? ""),
);

for (const existingUser of existingFixtureUsers) {
  const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
    existingUser.id,
  );

  if (deleteUserError) {
    throw deleteUserError;
  }
}

const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  throw error;
}

const user = data.user;

// Browser smoke exercises the same privileged role used by customer admins.
const { error: profileError } = await supabaseAdmin
  .from("user_profile")
  .upsert({
    id: user.id,
    email,
    full_name: "E2E Admin",
    alias: "E2E Admin",
    role: "main_admin",
    active: true,
  });

if (profileError) {
  throw profileError;
}

console.log(`Prepared local E2E state for: ${email}`);
