import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Brand } from "../../../../entities/brand/brand.types";
import { useBrandsQuery } from "../../../../entities/brand/useBrandsQuery";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { useBrandGroupsQuery } from "../../../../entities/brandGroup/useBrandGroupsQuery";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import {
  usePurgeBrandMutation,
  useRestoreBrandMutation,
} from "../model/useBrandArchiveMutations";
import {
  usePurgeBrandGroupMutation,
  useRestoreBrandGroupMutation,
} from "../model/useBrandGroupArchiveMutations";
import ManageArchivedBrandsDialog from "./ManageArchivedBrandsDialog";

vi.mock("../../../../entities/brand/useBrandsQuery", () => ({
  useBrandsQuery: vi.fn(),
}));

vi.mock("../../../../entities/brandGroup/useBrandGroupsQuery", () => ({
  useBrandGroupsQuery: vi.fn(),
}));

vi.mock("../../../auth/model/useAuthPermissions", () => ({
  useAuthPermissions: vi.fn(),
}));

vi.mock("../model/useBrandArchiveMutations", () => ({
  usePurgeBrandMutation: vi.fn(),
  useRestoreBrandMutation: vi.fn(),
}));

vi.mock("../model/useBrandGroupArchiveMutations", () => ({
  usePurgeBrandGroupMutation: vi.fn(),
  useRestoreBrandGroupMutation: vi.fn(),
}));

const mockedUseBrandsQuery = vi.mocked(useBrandsQuery);
const mockedUseBrandGroupsQuery = vi.mocked(useBrandGroupsQuery);
const mockedUseAuthPermissions = vi.mocked(useAuthPermissions);
const mockedUsePurgeBrandMutation = vi.mocked(usePurgeBrandMutation);
const mockedUseRestoreBrandMutation = vi.mocked(useRestoreBrandMutation);
const mockedUsePurgeBrandGroupMutation = vi.mocked(
  usePurgeBrandGroupMutation,
);
const mockedUseRestoreBrandGroupMutation = vi.mocked(
  useRestoreBrandGroupMutation,
);

const archivedGroup: BrandGroup = {
  active: false,
  active_before_archive: true,
  archived_at: "2026-07-30T12:00:00.000Z",
  archived_by: "10000000-0000-4000-8000-000000000001",
  display_order: 10,
  id: "group-1",
  name: "Lifecycle Group",
  slug: "lifecycle-group",
};

const activeGroup: BrandGroup = {
  ...archivedGroup,
  active: true,
  archived_at: null,
  archived_by: null,
  id: "group-2",
  name: "Active Group",
  slug: "active-group",
};

const makeArchivedBrand = (overrides: Partial<Brand>): Brand => ({
  active: false,
  active_before_archive: true,
  archived_at: "2026-07-30T12:00:00.000Z",
  archived_by: "10000000-0000-4000-8000-000000000001",
  archived_via_group_id: null,
  group_id: "group-1",
  id: "brand-1",
  name: "Archived Brand",
  slug: "archived-brand",
  ...overrides,
});

const archivedBrands = [
  makeArchivedBrand({
    archived_via_group_id: archivedGroup.id,
    id: "brand-1",
    name: "Group-owned Brand",
  }),
  makeArchivedBrand({
    id: "brand-2",
    name: "Individually Archived Child",
  }),
  makeArchivedBrand({
    group_id: activeGroup.id,
    id: "brand-3",
    name: "Standalone Archived Brand",
    slug: "standalone-archived-brand",
  }),
];

const createMutation = () => ({
  error: null,
  isError: false,
  isPending: false,
  mutate: vi.fn(),
  reset: vi.fn(),
  variables: undefined,
});

beforeEach(() => {
  mockedUseBrandsQuery.mockReturnValue({
    data: archivedBrands,
    isError: false,
    isPending: false,
  } as ReturnType<typeof useBrandsQuery>);
  mockedUseBrandGroupsQuery.mockImplementation((status) =>
    ({
      data: status === "archived" ? [archivedGroup] : [activeGroup],
      isError: false,
      isPending: false,
    }) as ReturnType<typeof useBrandGroupsQuery>,
  );
  mockedUseRestoreBrandMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof useRestoreBrandMutation>,
  );
  mockedUsePurgeBrandMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof usePurgeBrandMutation>,
  );
  mockedUseRestoreBrandGroupMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<
      typeof useRestoreBrandGroupMutation
    >,
  );
  mockedUsePurgeBrandGroupMutation.mockReturnValue(
    createMutation() as unknown as ReturnType<typeof usePurgeBrandGroupMutation>,
  );
});

afterEach(cleanup);

describe("ManageArchivedBrandsDialog", () => {
  it("restores groups and standalone brands through their own pipelines", async () => {
    const restoreBrandMutation = createMutation();
    const restoreGroupMutation = createMutation();
    mockedUseRestoreBrandMutation.mockReturnValue(
      restoreBrandMutation as unknown as ReturnType<
        typeof useRestoreBrandMutation
      >,
    );
    mockedUseRestoreBrandGroupMutation.mockReturnValue(
      restoreGroupMutation as unknown as ReturnType<
        typeof useRestoreBrandGroupMutation
      >,
    );
    mockedUseAuthPermissions.mockReturnValue({
      canPurgeServices: false,
    } as ReturnType<typeof useAuthPermissions>);
    const user = userEvent.setup();

    render(<ManageArchivedBrandsDialog isOpen onClose={vi.fn()} />);

    expect(screen.getByText(/1 brand restores · 1 stays archived/)).toBeTruthy();
    expect(screen.queryByText("Group-owned Brand")).toBeNull();
    expect(screen.queryByText("Individually Archived Child")).toBeNull();
    expect(screen.queryByText("Danger zone")).toBeNull();

    await user.click(
      screen.getByRole("button", { name: "Restore Lifecycle Group" }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Restore Standalone Archived Brand",
      }),
    );

    expect(restoreGroupMutation.mutate).toHaveBeenCalledWith(archivedGroup.id);
    expect(restoreBrandMutation.mutate).toHaveBeenCalledWith("brand-3");
  });

  it("warns an owner about the complete group purge impact", async () => {
    mockedUseAuthPermissions.mockReturnValue({
      canPurgeServices: true,
    } as ReturnType<typeof useAuthPermissions>);
    const user = userEvent.setup();

    render(<ManageArchivedBrandsDialog isOpen onClose={vi.fn()} />);

    await user.click(screen.getAllByText("Danger zone")[0]);
    await user.click(
      screen.getByRole("button", {
        name: "Purge Lifecycle Group permanently",
      }),
    );

    expect(
      screen.getByRole("textbox", {
        name: "Brand group name confirmation",
      }),
    ).toBeTruthy();
    expect(screen.getByText(/all 2 related brands/i)).toBeTruthy();
  });
});
