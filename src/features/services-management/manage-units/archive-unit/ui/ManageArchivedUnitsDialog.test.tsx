import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Unit } from "../../../../../entities/unit/unit.types";
import { useUnitsQuery } from "../../../../../entities/unit/useUnitsQuery";
import { useAuthPermissions } from "../../../../auth/model/useAuthPermissions";
import {
  usePurgeUnitMutation,
  useRestoreUnitMutation,
} from "../model/useUnitArchiveMutations";
import ManageArchivedUnitsDialog from "./ManageArchivedUnitsDialog";

vi.mock("../../../../../entities/unit/useUnitsQuery", () => ({
  useUnitsQuery: vi.fn(),
}));

vi.mock("../../../../auth/model/useAuthPermissions", () => ({
  useAuthPermissions: vi.fn(),
}));

vi.mock("../model/useUnitArchiveMutations", () => ({
  usePurgeUnitMutation: vi.fn(),
  useRestoreUnitMutation: vi.fn(),
}));

const mockedUseUnitsQuery = vi.mocked(useUnitsQuery);
const mockedUseAuthPermissions = vi.mocked(useAuthPermissions);
const mockedUsePurgeUnitMutation = vi.mocked(usePurgeUnitMutation);
const mockedUseRestoreUnitMutation = vi.mocked(useRestoreUnitMutation);

const archivedUnit: Unit = {
  active: false,
  active_before_archive: true,
  archived_at: "2026-07-27T12:00:00.000Z",
  archived_by: "11111111-1111-4111-8111-111111111111",
  can_be_commercial: false,
  can_be_gas: true,
  can_be_stacked: false,
  display_order: 20,
  id: "22222222-2222-4222-8222-222222222222",
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
  mockedUseUnitsQuery.mockReturnValue({
    data: [archivedUnit],
    isError: false,
    isPending: false,
  } as ReturnType<typeof useUnitsQuery>);
  mockedUseRestoreUnitMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof useRestoreUnitMutation>,
  );
  mockedUsePurgeUnitMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof usePurgeUnitMutation>,
  );
});

afterEach(cleanup);

describe("ManageArchivedUnitsDialog", () => {
  it("lets a main admin restore without exposing permanent purge", async () => {
    const restoreMutation = createMutation();
    mockedUseRestoreUnitMutation.mockReturnValue(
      restoreMutation as unknown as ReturnType<typeof useRestoreUnitMutation>,
    );
    mockedUseAuthPermissions.mockReturnValue({
      canPurgeServices: false,
    } as ReturnType<typeof useAuthPermissions>);
    const user = userEvent.setup();

    render(<ManageArchivedUnitsDialog isOpen onClose={vi.fn()} />);

    expect(screen.queryByText("Danger zone")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Restore" }));
    expect(restoreMutation.mutate).toHaveBeenCalledWith(archivedUnit.id);
  });

  it("lets an owner start purge and shows dependency impact", async () => {
    mockedUseAuthPermissions.mockReturnValue({
      canPurgeServices: true,
    } as ReturnType<typeof useAuthPermissions>);
    const user = userEvent.setup();

    render(<ManageArchivedUnitsDialog isOpen onClose={vi.fn()} />);

    await user.click(screen.getByText("Danger zone"));
    await user.click(
      screen.getByRole("button", { name: "Purge permanently" }),
    );

    expect(
      screen.getByRole("textbox", { name: "Unit name confirmation" }),
    ).toBeTruthy();
    expect(screen.getAllByText(/ignore-list references/i)).toHaveLength(2);
  });
});
