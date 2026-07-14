import { describe, expect, it } from "vitest";
import {
  getRoleLevel,
  isAllowedRole,
  hasRoleLevelOf,
  isAppRole,
  getAuthPermissions,
} from "./auth.permissions";

describe("auth.permissions", () => {
  describe("isAppRole", () => {
    it("returns true for valid app roles", () => {
      expect(isAppRole("user")).toBe(true);
      expect(isAppRole("secondary_admin")).toBe(true);
      expect(isAppRole("main_admin")).toBe(true);
      expect(isAppRole("owner")).toBe(true);
    });

    it("returns false for invalid roles", () => {
      expect(isAppRole("admin")).toBe(false);
      expect(isAppRole("")).toBe(false);
      expect(isAppRole(null)).toBe(false);
      expect(isAppRole(undefined)).toBe(false);
    });
  });

  describe("getRoleLevel", () => {
    it("returns correct role levels", () => {
      expect(getRoleLevel("user")).toBe(0);
      expect(getRoleLevel("secondary_admin")).toBe(1);
      expect(getRoleLevel("main_admin")).toBe(2);
      expect(getRoleLevel("owner")).toBe(3);
    });

    it("returns -1 for invalid roles", () => {
      expect(getRoleLevel("admin")).toBe(-1);
      expect(getRoleLevel("")).toBe(-1);
      expect(getRoleLevel(null)).toBe(-1);
      expect(getRoleLevel(undefined)).toBe(-1);
    });
  });

  describe("hasRoleLevelOf", () => {
    it("allows higher roles to pass lower requirements", () => {
      expect(hasRoleLevelOf("owner", "user")).toBe(true);
      expect(hasRoleLevelOf("owner", "main_admin")).toBe(true);
      expect(hasRoleLevelOf("main_admin", "secondary_admin")).toBe(true);
      expect(hasRoleLevelOf("secondary_admin", "user")).toBe(true);
    });

    it("does not allow lower roles to pass higher requirements", () => {
      expect(hasRoleLevelOf("user", "secondary_admin")).toBe(false);
      expect(hasRoleLevelOf("secondary_admin", "main_admin")).toBe(false);
      expect(hasRoleLevelOf("main_admin", "owner")).toBe(false);
    });

    it("returns false for invalid roles", () => {
      expect(hasRoleLevelOf(null, "user")).toBe(false);
      expect(hasRoleLevelOf("admin", "user")).toBe(false);
    });
  });

  describe("isAllowedRole", () => {
    it("returns true when role is in allowed roles", () => {
      expect(isAllowedRole("main_admin", ["main_admin", "owner"])).toBe(true);
      expect(isAllowedRole("owner", ["main_admin", "owner"])).toBe(true);
    });

    it("returns false when role is not in allowed roles", () => {
      expect(isAllowedRole("user", ["main_admin", "owner"])).toBe(false);
      expect(isAllowedRole(null, ["main_admin", "owner"])).toBe(false);
      expect(isAllowedRole("admin", ["main_admin", "owner"])).toBe(false);
    });
  });

  describe("getAuthPermissions", () => {
    it("returns no permissions when profile is null", () => {
      expect(getAuthPermissions(null)).toEqual({
        role: null,
        roleLevel: -1,

        canViewApp: false,
        canViewAdminPanel: false,

        canManageTechnicians: false,
        canDeleteTechnicians: false,
        canManageUsers: false,
        canManageServices: false,

        canUseOwnerTools: false,
      });
    });

    it("returns no permissions when profile is inactive", () => {
      expect(
        getAuthPermissions({
          role: "owner",
          active: false,
        }),
      ).toMatchObject({
        role: null,
        roleLevel: -1,
        canViewApp: false,
        canViewAdminPanel: false,
        canManageTechnicians: false,
        canDeleteTechnicians: false,
        canManageUsers: false,
        canManageServices: false,
        canUseOwnerTools: false,
      });
    });

    it("returns user permissions", () => {
      expect(
        getAuthPermissions({
          role: "user",
          active: true,
        }),
      ).toMatchObject({
        role: "user",
        roleLevel: 0,
        canViewApp: true,
        canViewAdminPanel: false,
        canManageTechnicians: false,
        canDeleteTechnicians: false,
        canManageUsers: false,
        canManageServices: false,
        canUseOwnerTools: false,
      });
    });

    it("returns secondary admin permissions", () => {
      expect(
        getAuthPermissions({
          role: "secondary_admin",
          active: true,
        }),
      ).toMatchObject({
        role: "secondary_admin",
        roleLevel: 1,
        canViewApp: true,
        canViewAdminPanel: true,
        canManageTechnicians: true,
        canDeleteTechnicians: false,
        canManageUsers: false,
        canManageServices: false,
        canUseOwnerTools: false,
      });
    });

    it("returns main admin permissions", () => {
      expect(
        getAuthPermissions({
          role: "main_admin",
          active: true,
        }),
      ).toMatchObject({
        role: "main_admin",
        roleLevel: 2,
        canViewApp: true,
        canViewAdminPanel: true,
        canManageTechnicians: true,
        canDeleteTechnicians: true,
        canManageUsers: true,
        canManageServices: true,
        canUseOwnerTools: false,
      });
    });

    it("returns owner permissions", () => {
      expect(
        getAuthPermissions({
          role: "owner",
          active: true,
        }),
      ).toMatchObject({
        role: "owner",
        roleLevel: 3,
        canViewApp: true,
        canViewAdminPanel: true,
        canManageTechnicians: true,
        canDeleteTechnicians: true,
        canManageUsers: true,
        canManageServices: true,
        canUseOwnerTools: true,
      });
    });
  });
});
