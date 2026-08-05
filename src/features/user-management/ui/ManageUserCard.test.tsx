import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import type { User } from "../../../entities/user/user.types";
import ManageUserCard from "./ManageUserCard";

afterEach(cleanup);

const user: User = {
  id: "user-1",
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  email: "owner@example.com",
  full_name: "Olivia Owner",
  alias: "Olivia",
  role: "owner",
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("ManageUserCard", () => {
  it("renders the managed user's identity and role", () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/users" element={<ManageUserCard user={user} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Olivia")).not.toBeNull();
    expect(screen.getByText("Olivia Owner")).not.toBeNull();
    expect(screen.getByText("owner@example.com")).not.toBeNull();
    expect(screen.getByText("Owner")).not.toBeNull();
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/users/user-1/edit",
    );
  });

  it("marks accounts that the actor can only view", () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route
            path="/users"
            element={<ManageUserCard user={user} isViewOnly />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("View only")).not.toBeNull();
  });

  it("marks the signed-in user's account", () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route
            path="/users"
            element={<ManageUserCard user={user} isCurrentUser />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Your account")).not.toBeNull();
  });
});
