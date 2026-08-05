import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { useSpecificIssuesQuery } from "../../../../entities/specific-issue/useSpecificIssuesQuery";
import type { Unit } from "../../../../entities/unit/unit.types";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import {
  usePurgeSpecificIssueMutation,
  useRestoreSpecificIssueMutation,
} from "../model/useSpecificIssueArchiveMutations";
import ManageArchivedSpecificIssuesDialog from "./ManageArchivedSpecificIssuesDialog";

vi.mock("../../../../entities/specific-issue/useSpecificIssuesQuery", () => ({
  useSpecificIssuesQuery: vi.fn(),
}));

vi.mock("../../../auth/model/useAuthPermissions", () => ({
  useAuthPermissions: vi.fn(),
}));

vi.mock("../model/useSpecificIssueArchiveMutations", () => ({
  usePurgeSpecificIssueMutation: vi.fn(),
  useRestoreSpecificIssueMutation: vi.fn(),
}));

const mockedUseSpecificIssuesQuery = vi.mocked(useSpecificIssuesQuery);
const mockedUseAuthPermissions = vi.mocked(useAuthPermissions);
const mockedUsePurgeMutation = vi.mocked(usePurgeSpecificIssueMutation);
const mockedUseRestoreMutation = vi.mocked(useRestoreSpecificIssueMutation);

const archivedIssue: SpecificIssue = {
  active: false,
  active_before_archive: true,
  archived_at: "2026-08-01T12:00:00.000Z",
  archived_by: "10000000-0000-4000-8000-000000000001",
  id: "issue-1",
  name: "No Heat",
  slug: "no-heat",
  unit_id: "unit-1",
};

const unit: Unit = {
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_commercial: false,
  can_be_gas: false,
  can_be_stacked: false,
  display_order: 10,
  id: "unit-1",
  is_built_in: false,
  name: "Dryer",
  slug: "dryer",
};

const createMutation = () => ({
  error: null,
  isError: false,
  isPending: false,
  mutate: vi.fn(),
  reset: vi.fn(),
  variables: undefined,
});

beforeEach(() => {
  mockedUseSpecificIssuesQuery.mockReturnValue({
    data: [archivedIssue],
    isError: false,
    isPending: false,
  } as ReturnType<typeof useSpecificIssuesQuery>);
  mockedUseRestoreMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<
      typeof useRestoreSpecificIssueMutation
    >,
  );
  mockedUsePurgeMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<
      typeof usePurgeSpecificIssueMutation
    >,
  );
});

afterEach(cleanup);

describe("ManageArchivedSpecificIssuesDialog", () => {
  it("restores an issue and shows its related unit", async () => {
    const restoreMutation = createMutation();
    mockedUseRestoreMutation.mockReturnValue(
      restoreMutation as unknown as ReturnType<
        typeof useRestoreSpecificIssueMutation
      >,
    );
    mockedUseAuthPermissions.mockReturnValue({
      canPurgeServices: false,
    } as ReturnType<typeof useAuthPermissions>);
    const user = userEvent.setup();

    render(
      <ManageArchivedSpecificIssuesDialog
        isOpen
        onClose={vi.fn()}
        unitsById={new Map([[unit.id, unit]])}
      />,
    );

    expect(screen.getByText(/no-heat · Dryer/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Restore No Heat" }));
    expect(restoreMutation.mutate).toHaveBeenCalledWith(archivedIssue.id);
  });

  it("requires typed owner confirmation before purge", async () => {
    mockedUseAuthPermissions.mockReturnValue({
      canPurgeServices: true,
    } as ReturnType<typeof useAuthPermissions>);
    const user = userEvent.setup();

    render(
      <ManageArchivedSpecificIssuesDialog
        isOpen
        onClose={vi.fn()}
        unitsById={new Map([[unit.id, unit]])}
      />,
    );

    await user.click(screen.getByText("Danger zone"));
    await user.click(
      screen.getByRole("button", { name: "Purge No Heat permanently" }),
    );

    expect(
      screen.getByRole("textbox", {
        name: "Specific issue name confirmation",
      }),
    ).toBeTruthy();
    expect(screen.getAllByText(/technician skills/i)).toHaveLength(2);
  });
});
