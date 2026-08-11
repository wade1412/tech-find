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
const statusOutput = execFileSync(
  statusExecutable,
  statusArguments,
  {
    cwd: workspace,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  },
);
const localSupabase = JSON.parse(statusOutput);
const supabaseUrl = localSupabase.API_URL;
const publishableKey = localSupabase.PUBLISHABLE_KEY ?? localSupabase.ANON_KEY;
const serviceRoleKey =
  localSupabase.SERVICE_ROLE_KEY ?? localSupabase.SECRET_KEY;

if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
  throw new Error("Local Supabase status is missing required E2E values");
}

const supabaseEndpoint = new URL(supabaseUrl);
const isLocalSupabase =
  ["127.0.0.1", "localhost"].includes(supabaseEndpoint.hostname) &&
  supabaseEndpoint.port === "54321";

if (!isLocalSupabase) {
  throw new Error(
    `Refusing to create E2E configuration for non-local Supabase: ${supabaseEndpoint.origin}`,
  );
}

const email = process.env.E2E_USER_EMAIL ?? "main-admin.e2e@techfind.test";
const password =
  process.env.E2E_USER_PASSWORD ?? "Local-E2E-MainAdmin-2026!";
const envFile = resolve(workspace, ".env.e2e.local");
const envContents = [
  `VITE_SUPABASE_URL=${supabaseUrl}`,
  `VITE_SUPABASE_PUBLISHABLE_KEY=${publishableKey}`,
  `E2E_SUPABASE_URL=${supabaseUrl}`,
  `E2E_SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`,
  `E2E_USER_EMAIL=${email}`,
  `E2E_USER_PASSWORD=${password}`,
  "",
].join("\n");

writeFileSync(envFile, envContents, { encoding: "utf8", mode: 0o600 });
console.log(`Prepared local E2E environment: ${envFile}`);
