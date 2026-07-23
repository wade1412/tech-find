import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../../../entities/user/user.types";
import type { AuthContextValue } from "../../auth/model/auth.types";
import { AuthContext } from "../../auth/model/AuthContext";
import { createUser } from "../api/createUser.api";
import NewUserForm from "./NewUserForm";

vi.mock("../api/createUser.api", () => ({
  createUser: vi.fn(),
}));

const mockedCreateUser = vi.mocked(createUser);

const ownerProfile: User = {
  active: true,
  alias: "Owner",
  created_at: "2026-01-01T00:00:00.000Z",
  email: "owner@example.com",
  full_name: "Olivia Owner",
  id: "11111111-1111-4111-8111-111111111111",
  role: "owner",
  updated_at: "2026-01-02T00:00:00.000Z",
};

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  const authValue: AuthContextValue = {
    authError: null,
    clearAuthError: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    isProfileLoading: false,
    profile: ownerProfile,
    retryProfile: vi.fn().mockResolvedValue(undefined),
    session: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
  };

  render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={["/users/new"]}>
          <Routes>
            <Route path="/users/new" element={<NewUserForm />} />
            <Route
              path="/users/:userId/edit"
              element={<p>User created</p>}
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  mockedCreateUser.mockReset();
});

afterEach(cleanup);

describe("NewUserForm", () => {
  it("does not create an incomplete user", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Alias" }),
      "Incomplete User",
    );
    await user.click(screen.getByRole("button", { name: "Create User" }));

    const errors = await screen.findAllByRole("alert");
    expect(errors.map((error) => error.textContent)).toContain(
      "Full name cannot be empty",
    );
    expect(errors.map((error) => error.textContent)).toContain(
      "Email cannot be empty",
    );
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });

  it("normalizes the form, creates the user, and opens the created profile", async () => {
    const user = userEvent.setup();
    const createdUser: User = {
      ...ownerProfile,
      alias: "New User",
      email: "new.user@example.com",
      full_name: "New User",
      id: "22222222-2222-4222-8222-222222222222",
      role: "user",
    };
    mockedCreateUser.mockResolvedValue(createdUser);
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Alias" }),
      "  New User  ",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Full name" }),
      "  New User  ",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "  NEW.USER@EXAMPLE.COM  ",
    );
    await user.click(screen.getByRole("button", { name: "Create User" }));

    await waitFor(() => expect(mockedCreateUser).toHaveBeenCalledTimes(1));
    expect(mockedCreateUser.mock.calls[0]?.[0]).toEqual({
      active: true,
      alias: "New User",
      email: "new.user@example.com",
      full_name: "New User",
      redirectTo: expect.stringMatching(/\/secure-email-link$/),
      role: "user",
    });
    expect(await screen.findByText("User created")).not.toBeNull();
  });
});
