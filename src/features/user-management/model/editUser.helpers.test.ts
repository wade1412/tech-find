import { describe, expect, it } from "vitest";
import type { AppRole, User } from "../../../entities/user/user.types";
import {
  buildCreateUserInput,
  buildUpdateUserInput,
  getCreatableUserRoles,
  getUserEditCapabilities,
  isNewUserFormDirty,
  isUserFormDirty,
} from "./editUser.helpers";

const makeUser = (overrides: Partial<User> = {}): User => ({
  active: true,
  active_before_archive: null,
  alias: "Alex",
  archived_at: null,
  archived_by: null,
  created_at: "2026-01-01T00:00:00.000Z",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  id: "target-user",
  role: "user",
  updated_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

function getCapabilities(actorId: string, actorRole: AppRole, target: User) {
  return getUserEditCapabilities({ actorId, actorRole, target });
}

describe("editUser helpers", () => {
  it("normalizes submitted names and email", () => {
    expect(
      buildUpdateUserInput(makeUser(), {
        active: true,
        alias: "  Alex J  ",
        email: "  ALEX@EXAMPLE.COM ",
        full_name: "  Alex Johnson  ",
        role: "secondary_admin",
      }),
    ).toEqual({
      active: true,
      alias: "Alex J",
      email: "alex@example.com",
      expectedUpdatedAt: "2026-01-01T00:00:00.000Z",
      full_name: "Alex Johnson",
      role: "secondary_admin",
      userId: "target-user",
    });
  });

  it("builds a normalized invitation input", () => {
    expect(
      buildCreateUserInput(
        {
          active: true,
          alias: "  Alex ",
          email: " ALEX@EXAMPLE.COM ",
          full_name: " Alex Johnson ",
          role: "user",
        },
        "https://example.com/secure-email-link",
      ),
    ).toEqual({
      active: true,
      alias: "Alex",
      email: "alex@example.com",
      full_name: "Alex Johnson",
      redirectTo: "https://example.com/secure-email-link",
      role: "user",
    });
  });

  it("detects meaningful input in a new-user form", () => {
    expect(
      isNewUserFormDirty({
        active: true,
        alias: "",
        email: "",
        full_name: "",
        role: "user",
      }),
    ).toBe(false);

    expect(
      isNewUserFormDirty({
        active: true,
        alias: "Alex",
        email: "",
        full_name: "",
        role: "user",
      }),
    ).toBe(true);
  });

  it("limits creatable roles by actor hierarchy", () => {
    expect(getCreatableUserRoles("owner")).toEqual([
      "user",
      "secondary_admin",
      "main_admin",
      "owner",
    ]);
    expect(getCreatableUserRoles("main_admin")).toEqual([
      "user",
      "secondary_admin",
    ]);
    expect(getCreatableUserRoles("secondary_admin")).toEqual([]);
  });

  it("does not mark formatting-only changes as dirty", () => {
    const user = makeUser();

    expect(
      isUserFormDirty(user, {
        active: user.active,
        alias: " Alex ",
        email: "ALEX@EXAMPLE.COM",
        full_name: " Alex Johnson ",
        role: user.role,
      }),
    ).toBe(false);
  });

  it("lets an owner edit another user's profile and access", () => {
    expect(
      getCapabilities("owner-user", "owner", makeUser()),
    ).toMatchObject({
      allowedRoles: ["user", "secondary_admin", "main_admin", "owner"],
      canEditAccess: true,
      canEditProfile: true,
      message: null,
    });
  });

  it("lets an owner edit their own profile but not their own access", () => {
    const target = makeUser({ id: "owner-user", role: "owner" });

    expect(getCapabilities("owner-user", "owner", target)).toMatchObject({
      canEditAccess: false,
      canEditProfile: true,
    });
  });

  it("lets a main admin manage lower roles only", () => {
    expect(
      getCapabilities("main-user", "main_admin", makeUser()),
    ).toMatchObject({
      allowedRoles: ["user", "secondary_admin"],
      canEditAccess: true,
      canEditProfile: true,
    });

    expect(
      getCapabilities(
        "main-user",
        "main_admin",
        makeUser({ role: "main_admin" }),
      ),
    ).toMatchObject({
      allowedRoles: [],
      canEditAccess: false,
      canEditProfile: false,
    });
  });

  it("denies user management to roles below main admin", () => {
    expect(
      getCapabilities("secondary-user", "secondary_admin", makeUser()),
    ).toMatchObject({
      canEditAccess: false,
      canEditProfile: false,
    });
  });
});
