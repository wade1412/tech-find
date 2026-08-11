import { describe, expect, it } from "vitest";
import { getAuthPermissions } from "../../features/auth/model/auth.permissions";
import { getAdminNavigationLinksFromPermissions } from "./adminNavigation";

describe("getAdminNavigationLinksFromPermissions", () => {
  it.each([
    ["user", []],
    ["secondary_admin", ["Technicians"]],
    ["main_admin", ["Technicians", "Users", "Services"]],
    ["owner", ["Technicians", "Users", "Services"]],
  ] as const)("returns permitted links for %s", (role, expectedLabels) => {
    const permissions = getAuthPermissions({ role, active: true });

    expect(
      getAdminNavigationLinksFromPermissions(permissions).map(
        ({ label }) => label,
      ),
    ).toEqual(expectedLabels);
  });

  it("returns no links for an inactive profile", () => {
    const permissions = getAuthPermissions({ role: "owner", active: false });

    expect(getAdminNavigationLinksFromPermissions(permissions)).toEqual([]);
  });
});
