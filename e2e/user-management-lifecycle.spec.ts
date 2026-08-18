import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let createdUserId: string | null = null;
const fixtureEmails = new Set<string>();

function getLocalAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.E2E_SUPABASE_URL;
  const serviceRoleKey = process.env.E2E_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing local Supabase cleanup credentials");
  }

  const endpoint = new URL(supabaseUrl);
  const isLocalSupabase =
    ["127.0.0.1", "localhost"].includes(endpoint.hostname) &&
    endpoint.port === "54321";

  if (!isLocalSupabase) {
    throw new Error(
      `Refusing user-management E2E access outside local Supabase: ${endpoint.origin}`,
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

test.afterEach(async () => {
  const admin = getLocalAdminClient();

  if (createdUserId) {
    const { error } = await admin.auth.admin.deleteUser(createdUserId);
    if (error && !error.message.toLowerCase().includes("not found")) {
      throw error;
    }

    const { error: profileCleanupError } = await admin
      .from("user_profile")
      .delete()
      .eq("id", createdUserId);
    if (profileCleanupError) throw profileCleanupError;
  }

  if (fixtureEmails.size > 0) {
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (error) throw error;

    for (const user of data.users) {
      if (fixtureEmails.has(user.email?.toLowerCase() ?? "")) {
        const { error: deleteError } =
          await admin.auth.admin.deleteUser(user.id);
        if (deleteError) throw deleteError;
      }
    }
  }

  createdUserId = null;
  fixtureEmails.clear();
});

test("main admin can manage a user through the full lifecycle", async ({
  page,
}) => {
  const adminEmail = process.env.E2E_USER_EMAIL;
  const adminPassword = process.env.E2E_USER_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Missing E2E main-admin credentials");
  }

  const suffix = crypto.randomUUID().slice(0, 8);
  const alias = `E2E User ${suffix}`;
  const editedAlias = `${alias} Edited`;
  const fullName = `E2E Lifecycle ${suffix}`;
  const editedFullName = `${fullName} Updated`;
  const email = `e2e.user.${suffix}@techfind.test`;
  const editedEmail = `e2e.user.${suffix}.updated@techfind.test`;
  const runtimeErrors: string[] = [];

  fixtureEmails.add(email);
  fixtureEmails.add(editedEmail);

  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  const archivedUserItem = () =>
    page
      .getByRole("dialog", { name: /archived users/i })
      .getByRole("listitem")
      .filter({ hasText: editedAlias });

  const archiveCurrentUser = async () => {
    await page.getByRole("button", { name: "Archive User" }).click();
    const dialog = page.getByRole("dialog", { name: /archive user/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Archive user" }).click();
    await expect(page).toHaveURL(/\/users$/);
  };

  await test.step("Login as a customer main admin", async () => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(adminEmail);
    await page.getByLabel(/password/i).fill(adminPassword);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  await test.step(
    "Invite the user and create both Auth and profile records",
    async () => {
      await page.goto("/users");
      await expect(
        page.getByRole("heading", { name: "Manage Users" }),
      ).toBeVisible();
      await page.getByRole("link", { name: "Create User" }).click();
      await expect(
        page.getByRole("heading", { name: "New User" }),
      ).toBeVisible();

      await page.getByLabel("Alias").fill(alias);
      await page.getByLabel("Full name").fill(fullName);
      await page.getByLabel("Email").fill(email);
      await page.getByRole("button", { name: "Create User" }).click();

      await expect(page).toHaveURL(/\/users\/[0-9a-f-]+\/edit$/i);
      await expect(page.getByRole("heading", { name: alias })).toBeVisible();

      const match = page.url().match(/\/users\/([0-9a-f-]+)\/edit$/i);
      createdUserId = match?.[1] ?? null;
      expect(createdUserId).toBeTruthy();

      const admin = getLocalAdminClient();
      const { data: profile, error: profileError } = await admin
        .from("user_profile")
        .select("id,email,role,active,archived_at")
        .eq("id", createdUserId!)
        .single();
      if (profileError) throw profileError;

      expect(profile).toMatchObject({
        active: true,
        archived_at: null,
        email,
        role: "user",
      });

      const { data: authData, error: authError } =
        await admin.auth.admin.getUserById(createdUserId!);
      if (authError) throw authError;
      expect(authData.user.email).toBe(email);
    },
  );

  await test.step("Edit synchronized profile and Auth data", async () => {
    await page.getByLabel("Alias").fill(editedAlias);
    await page.getByLabel("Full name").fill(editedFullName);
    await page.getByLabel("Email").fill(editedEmail);
    await page.getByRole("button", { name: "Save Changes" }).click();
    await expect(page.getByText("Changes saved")).toBeVisible();

    await page.reload();
    await expect(page.getByLabel("Alias")).toHaveValue(editedAlias);
    await expect(page.getByLabel("Full name")).toHaveValue(editedFullName);
    await expect(page.getByLabel("Email")).toHaveValue(editedEmail);

    const admin = getLocalAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("user_profile")
      .select("alias,email,full_name")
      .eq("id", createdUserId!)
      .single();
    if (profileError) throw profileError;
    expect(profile).toMatchObject({
      alias: editedAlias,
      email: editedEmail,
      full_name: editedFullName,
    });

    const { data: authData, error: authError } =
      await admin.auth.admin.getUserById(createdUserId!);
    if (authError) throw authError;
    expect(authData.user.email).toBe(editedEmail);
  });

  await test.step("Archive and immediately block the user", async () => {
    await archiveCurrentUser();

    const admin = getLocalAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("user_profile")
      .select("active,active_before_archive,archived_at")
      .eq("id", createdUserId!)
      .single();
    if (profileError) throw profileError;
    expect(profile.active).toBe(false);
    expect(profile.active_before_archive).toBe(true);
    expect(profile.archived_at).toBeTruthy();

    const { data: authData, error: authError } =
      await admin.auth.admin.getUserById(createdUserId!);
    if (authError) throw authError;
    expect(new Date(authData.user.banned_until!).getTime()).toBeGreaterThan(
      Date.now(),
    );
  });

  await test.step("Restore the user and previous active state", async () => {
    await page.getByRole("button", { name: "Archived Users" }).click();
    const archiveDialog = page.getByRole("dialog", {
      name: /archived users/i,
    });
    const archivedUser = archivedUserItem();
    await expect(archiveDialog).toBeVisible();
    await expect(archivedUser).toBeVisible();
    await archivedUser.getByRole("button", { name: "Restore" }).click();
    await expect(archivedUser).toHaveCount(0);
    await archiveDialog.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText(editedAlias, { exact: true })).toBeVisible();

    const admin = getLocalAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("user_profile")
      .select("active,active_before_archive,archived_at")
      .eq("id", createdUserId!)
      .single();
    if (profileError) throw profileError;
    expect(profile).toMatchObject({
      active: true,
      active_before_archive: null,
      archived_at: null,
    });
  });

  await test.step(
    "Archive again and permanently purge as main admin",
    async () => {
      await page
        .getByRole("link", { name: new RegExp(editedAlias) })
        .click();
      await expect(page).toHaveURL(/\/users\/[0-9a-f-]+\/edit$/i);
      await archiveCurrentUser();

      await page.getByRole("button", { name: "Archived Users" }).click();
      const archiveDialog = page.getByRole("dialog", {
        name: /archived users/i,
      });
      const archivedUser = archivedUserItem();
      await expect(archivedUser).toBeVisible();
      await archiveDialog.getByText("Danger zone", { exact: true }).click();
      await archivedUser
        .getByRole("button", { name: "Purge permanently" })
        .click();

      const purgeDialog = page.getByRole("dialog", {
        name: /permanently purge user/i,
      });
      await expect(purgeDialog).toBeVisible();
      await purgeDialog
        .getByLabel("User alias confirmation")
        .fill(editedAlias);
      await purgeDialog
        .getByRole("button", { name: "Purge permanently" })
        .click();
      await expect(purgeDialog).toHaveCount(0);
      await expect(archivedUser).toHaveCount(0);

      const admin = getLocalAdminClient();
      const { data: profile, error: profileError } = await admin
        .from("user_profile")
        .select("id")
        .eq("id", createdUserId!)
        .maybeSingle();
      if (profileError) throw profileError;
      expect(profile).toBeNull();

      const { error: authError } =
        await admin.auth.admin.getUserById(createdUserId!);
      expect(authError).toBeTruthy();
    },
  );

  expect(runtimeErrors, "Unexpected browser runtime errors").toEqual([]);
});
