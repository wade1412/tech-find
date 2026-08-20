import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

const fileEnv = loadEnv("e2e", process.cwd(), "");
const getEnv = (key) => process.env[key] ?? fileEnv[key];

const supabaseUrl = getEnv("E2E_SUPABASE_URL");
const serviceRoleKey = getEnv("E2E_SUPABASE_SERVICE_ROLE_KEY");

const demoUsers = [
  {
    email: getEnv("DEMO_MAIN_ADMIN_EMAIL"),
    password: getEnv("DEMO_MAIN_ADMIN_PASSWORD"),
    fullName: "Demo Main Admin",
    alias: "Demo Main Admin",
    role: "main_admin",
  },
  {
    email: getEnv("DEMO_SECONDARY_ADMIN_EMAIL"),
    password: getEnv("DEMO_SECONDARY_ADMIN_PASSWORD"),
    fullName: "Demo Secondary Admin",
    alias: "Demo Secondary Admin",
    role: "secondary_admin",
  },
  {
    email: getEnv("DEMO_USER_EMAIL"),
    password: getEnv("DEMO_USER_PASSWORD"),
    fullName: "Demo User",
    alias: "Demo User",
    role: "user",
  },
];

// Check variables and credentials
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing E2E_SUPABASE_URL or E2E_SUPABASE_SERVICE_ROLE_KEY");
}

for (const demoUser of demoUsers) {
  if (!demoUser.email || !demoUser.password) {
    throw new Error(`Missing credentials for demo role: ${demoUser.role}`);
  }
}

// If DB is not running locally - throw error
const supabaseEndpoint = new URL(supabaseUrl);
const isLocalSupabase =
  ["127.0.0.1", "localhost"].includes(supabaseEndpoint.hostname) &&
  supabaseEndpoint.port === "54321";

if (!isLocalSupabase) {
  throw new Error(
    `Refusing to prepare E2E data outside local Supabase: ${supabaseEndpoint.origin}`,
  );
}

// Setup Supabase Admin
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const { data: usersData, error: listError } =
  await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

if (listError) {
  throw listError;
}

for (const demoUser of demoUsers) {
  // Check if the user exists
  const existingUser = usersData.users.find(
    (user) => user.email.toLowerCase() === demoUser.email.toLowerCase(),
  );

  let user;

  // If exists - update with the relevant information
  if (existingUser) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      {
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
      },
    );

    if (error) throw error;

    user = data.user;
  } else {
    // Otherwise - create new user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: demoUser.email,
      password: demoUser.password,
      email_confirm: true,
    });

    if (error) throw error;

    user = data.user;
  }

  if (!user) {
    throw new Error(`Auth user was not created: ${demoUser.email}`);
  }

  // Upsert (update or insert) user information in user_profile db table
  const { error: profileError } = await supabaseAdmin
    .from("user_profile")
    .upsert(
      {
        id: user.id,
        email: demoUser.email,
        full_name: demoUser.fullName,
        alias: demoUser.alias,
        role: demoUser.role,
        active: true,
        archived_at: null,
        archived_by: null,
        active_before_archive: null,
      },
      { onConflict: "id" },
    );

  if (profileError) throw profileError;

  console.log(`Prepared local demo user: ${demoUser.email} (${demoUser.role})`);
}
