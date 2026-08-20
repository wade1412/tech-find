import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const workspace = process.cwd();
const isWindows = process.platform === "win32";
const statusExecutable = isWindows
  ? (process.env.ComSpec ?? "cmd.exe")
  : "npx";
const statusArguments = isWindows
  ? ["/d", "/s", "/c", "npx.cmd supabase status -o json"]
  : ["supabase", "status", "-o", "json"];
const statusOutput = execFileSync(statusExecutable, statusArguments, {
  cwd: workspace,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"],
});
const localSupabase = JSON.parse(statusOutput);
const supabaseUrl = localSupabase.API_URL;
const publishableKey = localSupabase.PUBLISHABLE_KEY ?? localSupabase.ANON_KEY;
const serviceRoleKey =
  localSupabase.SERVICE_ROLE_KEY ?? localSupabase.SECRET_KEY;

if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
  throw new Error("Local Supabase status is missing required demo values");
}

const supabaseEndpoint = new URL(supabaseUrl);
const isLocalSupabase =
  ["127.0.0.1", "localhost"].includes(supabaseEndpoint.hostname) &&
  supabaseEndpoint.port === "54321";

if (!isLocalSupabase) {
  throw new Error(
    `Refusing to create demo configuration for non-local Supabase: ${supabaseEndpoint.origin}`,
  );
}

const envFile = resolve(workspace, ".env.demo.local");
const envContents = [
  `VITE_SUPABASE_URL=${supabaseUrl}`,
  `VITE_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
  `DEMO_SUPABASE_URL=${supabaseUrl}`,
  `DEMO_SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`,
  `DEMO_MAIN_ADMIN_EMAIL=${process.env.DEMO_MAIN_ADMIN_EMAIL ?? "main-admin.demo@techfind.test"}`,
  `DEMO_MAIN_ADMIN_PASSWORD=${process.env.DEMO_MAIN_ADMIN_PASSWORD ?? "LocalDemoMainAdmin2026"}`,
  `DEMO_SECONDARY_ADMIN_EMAIL=${process.env.DEMO_SECONDARY_ADMIN_EMAIL ?? "secondary-admin.demo@techfind.test"}`,
  `DEMO_SECONDARY_ADMIN_PASSWORD=${process.env.DEMO_SECONDARY_ADMIN_PASSWORD ?? "LocalDemoSecondaryAdmin2026"}`,
  `DEMO_USER_EMAIL=${process.env.DEMO_USER_EMAIL ?? "user.demo@techfind.test"}`,
  `DEMO_USER_PASSWORD=${process.env.DEMO_USER_PASSWORD ?? "LocalDemoUser2026"}`,
  "",
].join("\n");

writeFileSync(envFile, envContents, { encoding: "utf8", mode: 0o600 });
console.log(`Prepared local demo environment: ${envFile}`);
