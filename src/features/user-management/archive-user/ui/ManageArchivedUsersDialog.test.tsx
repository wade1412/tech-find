import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../../../../entities/user/user.types";
import type { AuthContextValue } from "../../../auth/model/auth.types";
import { AuthContext } from "../../../auth/model/AuthContext";
import { useUsersQuery } from "../../../../entities/user/useUsersQuery";
import {
  usePurgeUserMutation,
  useRestoreUserMutation,
} from "../model/useUserArchiveMutations";
import ManageArchivedUsersDialog from "./ManageArchivedUsersDialog";

vi.mock("../../../../entities/user/useUsersQuery", () => ({
  useUsersQuery: vi.fn(),
}));

vi.mock("../model/useUserArchiveMutations", () => ({
  usePurgeUserMutation: vi.fn(),
  useRestoreUserMutation: vi.fn(),
}));

const mockedUseUsersQuery = vi.mocked(useUsersQuery);
const mockedUsePurgeUserMutation = vi.mocked(usePurgeUserMutation);
const mockedUseRestoreUserMutation = vi.mocked(useRestoreUserMutation);

const makeUser = (overrides: Partial<User> = {}): User => ({
  active: false,
  active_before_archive: true,
  alias: "Alex",
  archived_at: "2026-07-24T12:00:00.000Z",
  archived_by: "11111111-1111-4111-8111-111111111111",
  created_at: "2026-01-01T00:00:00.000Z",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  id: "22222222-2222-4222-8222-222222222222",
  role: "user",
  updated_at: "2026-07-24T12:00:00.000Z",
  ...overrides,
});

const createMutation = () => ({
  error: null,
  isError: false,
  isPending: false,
  mutate: vi.fn(),
  reset: vi.fn(),
  variables: undefined,
});

function renderDialog(actorRole: User["role"]) {
  const actor = makeUser({
    active: true,
    active_before_archive: null,
    alias: "Actor",
    archived_at: null,
    archived_by: null,
    id: "11111111-1111-4111-8111-111111111111",
    role: actorRole,
  });
  const authValue: AuthContextValue = {
    authError: null,
    clearAuthError: vi.fn(),
    isAuthenticated: true,
    isLoading: false,
    isProfileLoading: false,
    profile: actor,
    retryProfile: vi.fn(),
    session: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
    user: null,
  };

  render(
    <AuthContext.Provider value={authValue}>
      <ManageArchivedUsersDialog isOpen onClose={vi.fn()} />
    </AuthContext.Provider>,
  );
}

beforeEach(() => {
  mockedUseUsersQuery.mockReturnValue({
    data: [makeUser()],
    isError: false,
    isPending: false,
  } as ReturnType<typeof useUsersQuery>);
  mockedUseRestoreUserMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof useRestoreUserMutation>,
  );
  mockedUsePurgeUserMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof usePurgeUserMutation>,
  );
});

afterEach(cleanup);

describe("ManageArchivedUsersDialog", () => {
  it("lets a main admin restore a lower-role archived user without exposing purge", async () => {
    const user = userEvent.setup();
    const restoreMutation = createMutation();
    mockedUseRestoreUserMutation.mockReturnValue(
      restoreMutation as unknown as ReturnType<typeof useRestoreUserMutation>,
    );

    renderDialog("main_admin");

    expect(screen.queryByText("Danger zone")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(restoreMutation.mutate).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
    );
  });

  it("shows peer main admins as view only", () => {
    mockedUseUsersQuery.mockReturnValue({
      data: [makeUser({ role: "main_admin" })],
      isError: false,
      isPending: false,
    } as ReturnType<typeof useUsersQuery>);

    renderDialog("main_admin");

    expect(screen.getByText("View only")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Restore" })).toBeNull();
  });

  it("lets an owner start permanent purge from the danger zone", async () => {
    const user = userEvent.setup();

    renderDialog("owner");

    await user.click(screen.getByText("Danger zone"));
    await user.click(
      screen.getByRole("button", { name: "Purge permanently" }),
    );

    expect(
      screen.getByRole("textbox", { name: "User alias confirmation" }),
    ).not.toBeNull();
  });
});
