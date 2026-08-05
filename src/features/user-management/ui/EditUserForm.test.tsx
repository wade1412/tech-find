import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../../../entities/user/user.types";
import type { AuthContextValue } from "../../auth/model/auth.types";
import { AuthContext } from "../../auth/model/AuthContext";
import { updateUser } from "../api/updateUser.api";
import EditUserForm from "./EditUserForm";

vi.mock("../api/updateUser.api", () => ({
  updateUser: vi.fn(),
}));

const mockedUpdateUser = vi.mocked(updateUser);

const targetUser: User = {
  active: true,
  active_before_archive: null,
  alias: "Alex",
  archived_at: null,
  archived_by: null,
  created_at: "2026-01-01T00:00:00.000Z",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  id: "22222222-2222-4222-8222-222222222222",
  role: "user",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const ownerProfile: User = {
  ...targetUser,
  alias: "Owner",
  email: "owner@example.com",
  full_name: "Olivia Owner",
  id: "11111111-1111-4111-8111-111111111111",
  role: "owner",
};

function renderForm({
  actor = ownerProfile,
  user = targetUser,
}: {
  actor?: User;
  user?: User;
} = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  const retryProfile = vi.fn().mockResolvedValue(undefined);
  const authValue: AuthContextValue = {
    authError: null,
    clearAuthError: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    isProfileLoading: false,
    profile: actor,
    retryProfile,
    session: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
  };

  render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <EditUserForm user={user} />
      </AuthContext.Provider>
    </QueryClientProvider>,
  );

  return { queryClient, retryProfile };
}

beforeEach(() => {
  mockedUpdateUser.mockReset();
});

afterEach(cleanup);

describe("EditUserForm", () => {
  it("shows validation errors and does not submit invalid data", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.clear(screen.getByRole("textbox", { name: "Alias" }));
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Alias cannot be empty",
    );
    expect(mockedUpdateUser).not.toHaveBeenCalled();
  });

  it("submits normalized values with the expected profile version", async () => {
    const user = userEvent.setup();
    mockedUpdateUser.mockResolvedValue({
      ...targetUser,
      alias: "Alex J",
      updated_at: "2026-01-03T00:00:00.000Z",
    });
    renderForm();

    await user.clear(screen.getByRole("textbox", { name: "Alias" }));
    await user.type(
      screen.getByRole("textbox", { name: "Alias" }),
      "  Alex J  ",
    );
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => expect(mockedUpdateUser).toHaveBeenCalledTimes(1));
    expect(mockedUpdateUser.mock.calls[0]?.[0]).toEqual({
      active: true,
      alias: "Alex J",
      email: "alex@example.com",
      expectedUpdatedAt: targetUser.updated_at,
      full_name: "Alex Johnson",
      role: "user",
      userId: targetUser.id,
    });
    expect(await screen.findByText("Changes saved")).not.toBeNull();
  });

  it("submits account deactivation through the access switch", async () => {
    const user = userEvent.setup();
    mockedUpdateUser.mockResolvedValue({
      ...targetUser,
      active: false,
      updated_at: "2026-01-03T00:00:00.000Z",
    });
    renderForm();

    await user.click(screen.getByRole("switch", { name: "User access" }));
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => expect(mockedUpdateUser).toHaveBeenCalledTimes(1));
    expect(mockedUpdateUser.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        active: false,
        expectedUpdatedAt: targetUser.updated_at,
        userId: targetUser.id,
      }),
    );
  });

  it("renders peer main-admin accounts as view only", () => {
    renderForm({
      actor: {
        ...ownerProfile,
        role: "main_admin",
      },
      user: {
        ...targetUser,
        role: "main_admin",
      },
    });

    expect(
      screen.getByText(
        "Main admins cannot edit another main admin user profile.",
      ),
    ).not.toBeNull();
    expect(
      screen.getByRole<HTMLInputElement>("textbox", { name: "Alias" })
        .disabled,
    ).toBe(true);
    expect(
      screen.getByRole<HTMLInputElement>("combobox", { name: "Role" })
        .disabled,
    ).toBe(true);
    expect(
      screen.getByRole<HTMLButtonElement>("switch", { name: "User access" })
        .disabled,
    ).toBe(true);
  });

  it("shows an optimistic-concurrency error returned by the server", async () => {
    const user = userEvent.setup();
    mockedUpdateUser.mockRejectedValue(
      new Error(
        "This user was changed by another administrator. Discard your changes to load the latest version.",
      ),
    );
    renderForm();

    await user.clear(screen.getByRole("textbox", { name: "Alias" }));
    await user.type(
      screen.getByRole("textbox", { name: "Alias" }),
      "Updated",
    );
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "This user was changed by another administrator.",
    );
  });
});
