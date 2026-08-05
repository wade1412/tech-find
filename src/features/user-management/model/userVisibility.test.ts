import { describe, expect, it } from "vitest";
import type { User } from "../../../entities/user/user.types";
import {
  getUsersVisibleToRole,
  putCurrentUserFirst,
} from "./userVisibility";

const makeUser = (id: string, role: User["role"]): User => ({
  active: true,
  active_before_archive: null,
  alias: id,
  archived_at: null,
  archived_by: null,
  created_at: "2026-01-01T00:00:00.000Z",
  email: `${id}@example.com`,
  full_name: id,
  id,
  role,
  updated_at: "2026-01-01T00:00:00.000Z",
});

describe("putCurrentUserFirst", () => {
  it("moves the current user first without changing the other users' order", () => {
    expect(
      putCurrentUserFirst(users, "main-admin").map(({ id }) => id),
    ).toEqual(["main-admin", "regular-user", "owner-user"]);
  });

  it("keeps the order when the current user is not in the list", () => {
    expect(
      putCurrentUserFirst(users, "missing-user").map(({ id }) => id),
    ).toEqual(["regular-user", "main-admin", "owner-user"]);
  });
});

const users = [
  makeUser("regular-user", "user"),
  makeUser("main-admin", "main_admin"),
  makeUser("owner-user", "owner"),
];

describe("getUsersVisibleToRole", () => {
  it("lets owners see owner accounts", () => {
    expect(getUsersVisibleToRole(users, "owner").map(({ id }) => id)).toEqual([
      "regular-user",
      "main-admin",
      "owner-user",
    ]);
  });

  it.each(["main_admin", "secondary_admin", "user", null] as const)(
    "hides owner accounts from %s viewers",
    (role) => {
      expect(getUsersVisibleToRole(users, role).map(({ id }) => id)).toEqual([
        "regular-user",
        "main-admin",
      ]);
    },
  );
});
