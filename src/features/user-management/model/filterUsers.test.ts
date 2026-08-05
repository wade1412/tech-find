import { describe, expect, it } from "vitest";
import type { User } from "../../../entities/user/user.types";
import { filterUsers } from "./filterUsers";

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-1",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  alias: "Alex",
  role: "user",
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const users = [
  makeUser(),
  makeUser({
    id: "user-2",
    alias: "Morgan",
    full_name: "Morgan Reed",
    email: "morgan@example.com",
    role: "main_admin",
    active: false,
  }),
];

describe("filterUsers", () => {
  it("matches all normalized search terms across visible user fields", () => {
    expect(
      filterUsers({
        users,
        searchTerm: "MORGAN, main-admin",
        status: "all",
      }).map(({ id }) => id),
    ).toEqual(["user-2"]);
  });

  it("matches full names and emails", () => {
    expect(
      filterUsers({ users, searchTerm: "johnson alex@example", status: "all" })
        .map(({ id }) => id),
    ).toEqual(["user-1"]);
  });

  it.each([
    ["active", ["user-1"]],
    ["inactive", ["user-2"]],
  ] as const)("applies the %s status filter", (status, expectedIds) => {
    expect(
      filterUsers({ users, searchTerm: "", status }).map(({ id }) => id),
    ).toEqual(expectedIds);
  });

  it("does not match timestamps that are not displayed in the card", () => {
    expect(
      filterUsers({ users, searchTerm: "2026-01-01", status: "all" }),
    ).toEqual([]);
  });
});
