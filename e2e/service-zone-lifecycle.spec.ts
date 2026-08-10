import { test, expect } from "@playwright/test";

test("service zone full lifecycle", async ({ page }) => {
  // Credentials
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  // Unique Zone values
  const suffix = crypto.randomUUID().slice(0, 8);

  const zoneName = `E2E Zone ${suffix}`;
  const zoneSlug = `e2e-zone-${suffix}`;
  const displayOrder = "999";

  // Archive Zone Helper
  const archiveCurrentZone = async () => {
    const dialog = page.getByRole("dialog", { name: /archive service zone/i });

    // Open dialog
    await page.getByRole("button", { name: "Archive Service Zone" }).click();
    await expect(dialog).toBeVisible();

    // Archive zone
    await dialog.getByRole("button", { name: /archive service zone/i }).click();

    // Check redirect
    await expect(page).toHaveURL(/\/services\?section=service_zones$/);
  };

  if (!email || !password) {
    throw new Error("Missing E2E credentials");
  }

  // Login
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).not.toHaveURL(/login/);

  // ----- Create Zone Test -----
  // Navigate to manage services - create zone
  await page.goto("/services?section=service_zones");
  await expect(
    page.getByRole("heading", { name: /service zones/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /create zone/i }).click();
  await expect(
    page.getByRole("heading", { name: /new service zone/i }),
  ).toBeVisible();

  // Fill inputs and submit
  await page.getByLabel("Zone name").fill(zoneName);
  await page.getByLabel("Slug").fill(zoneSlug);
  await page.getByLabel("Display order").fill(displayOrder);
  await page.getByRole("button", { name: "Create Zone" }).click();

  // Check if the zone had been created
  await expect(page).toHaveURL(/\/services\/zones\/[^/]+\/edit$/);
  await expect(page.getByRole("heading", { name: zoneName })).toBeVisible();

  // ----- Edit Zone Test -----
  const editedZoneName = `${zoneName} Edited`;
  const zoneNameInput = page.getByLabel("Zone name");

  // Change Zone name and check isDirty form status
  await zoneNameInput.fill(editedZoneName);
  await expect(
    page.getByRole("button", { name: "Save Changes" }),
  ).toBeEnabled();

  // Save changes: saving opens a snackbar
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Changes saved")).toBeVisible();

  // Check for DB persisting changes after page reload
  await page.reload();
  await expect(page.getByLabel("Zone name")).toHaveValue(editedZoneName);

  // ----- Archive Zone Test ------
  await archiveCurrentZone();
  // Check zone absence
  await expect(page.getByText(editedZoneName, { exact: true })).toHaveCount(0);

  // ----- Restore Zone Test -----
  const archivedZonesDialog = page.getByRole("dialog", {
    name: "Archived Service Zones",
  });
  const archivedZoneItem = archivedZonesDialog
    .getByRole("listitem")
    .filter({ hasText: editedZoneName });

  // Open Archived Zones Dialog
  await page.getByRole("button", { name: /archived service zones/i }).click();
  await expect(archivedZonesDialog).toBeVisible();

  // Check if zone is archived and restore
  await expect(
    archivedZonesDialog.getByText(editedZoneName, { exact: true }),
  ).toBeVisible();
  await archivedZoneItem.getByRole("button", { name: "Restore" }).click();

  // Check absence in dialog after restore and close
  await expect(
    archivedZonesDialog
      .getByRole("listitem")
      .filter({ hasText: editedZoneName }),
  ).toHaveCount(0);
  await archivedZonesDialog.getByRole("button", { name: /close/i }).click();

  // Check zone presence in zone list
  await expect(page.getByText(editedZoneName, { exact: true })).toBeVisible();

  // ----- Purge Zone Test -----
  const purgeArchiveDialog = page.getByRole("dialog", {
    name: "Archived Service Zones",
  });
  const zoneToPurge = purgeArchiveDialog
    .getByRole("listitem")
    .filter({ hasText: editedZoneName });
  const purgeConfirmationDialog = page.getByRole("dialog", { name: /purge/i });

  // Navigate to edit zone page and archive zone
  await page.getByRole("link", { name: editedZoneName }).click();
  await expect(page).toHaveURL(/\/services\/zones\/[^/]+\/edit$/);
  await archiveCurrentZone();

  // Open Archive, danger zone and click purge
  await page.getByRole("button", { name: /archived service zones/i }).click();
  await expect(zoneToPurge).toBeVisible();
  await zoneToPurge.getByRole("button", { name: /danger zone/i }).click();
  await zoneToPurge.getByRole("button", { name: /purge permanently/i }).click();

  // Confirm purge
  await expect(purgeConfirmationDialog).toBeVisible();
  await purgeConfirmationDialog
    .getByLabel("Service zone name confirmation")
    .fill(editedZoneName);
  await purgeConfirmationDialog
    .getByRole("button", { name: "Purge permanently" })
    .click();

  // Check if purged succesfully on DB level
  await expect(
    purgeArchiveDialog.getByText(editedZoneName, { exact: true }),
  ).toHaveCount(0);
  await purgeArchiveDialog.getByRole("button", { name: /close/i }).click();
  await page.reload();
  await page.getByRole("button", { name: /archived service zones/i }).click();
  await expect(
    page
      .getByRole("dialog", { name: "Archived Service Zones" })
      .getByText(editedZoneName, { exact: true }),
  ).toHaveCount(0);
});
