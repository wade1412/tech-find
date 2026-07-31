import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { BrandFormState } from "../model/manage-brands.types";
import EditBrandFields from "./EditBrandFields";

afterEach(cleanup);

const brandGroups: BrandGroup[] = [
  {
    active: true,
    active_before_archive: null,
    archived_at: null,
    archived_by: null,
    display_order: 10,
    id: "group-1",
    name: "Home Appliances",
    slug: "home-appliances",
  },
  {
    active: false,
    active_before_archive: null,
    archived_at: null,
    archived_by: null,
    display_order: 20,
    id: "group-2",
    name: "Legacy Appliances",
    slug: "legacy-appliances",
  },
];

const formState: BrandFormState = {
  active: true,
  group_id: "group-1",
  name: "KitchenAid",
  slug: "kitchenaid",
};

describe("EditBrandFields", () => {
  it("renders the current values and identifies inactive group options", async () => {
    const user = userEvent.setup();

    render(
      <EditBrandFields
        brandGroups={brandGroups}
        disabled={false}
        errors={null}
        formState={formState}
        onFieldChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Brand name" })).toHaveProperty(
      "value",
      "KitchenAid",
    );
    expect(screen.getByRole("combobox", { name: "Brand group" })).toHaveProperty(
      "value",
      "Home Appliances",
    );

    await user.click(screen.getByRole("combobox", { name: "Brand group" }));
    expect(
      screen.getByRole("option", { name: "Legacy Appliances (Inactive)" }),
    ).toBeTruthy();
  });

  it("emits the selected brand group id", async () => {
    const onFieldChange = vi.fn();
    const user = userEvent.setup();

    render(
      <EditBrandFields
        brandGroups={brandGroups}
        disabled={false}
        errors={null}
        formState={formState}
        onFieldChange={onFieldChange}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Brand group" }));
    await user.click(
      screen.getByRole("option", { name: "Legacy Appliances (Inactive)" }),
    );

    expect(onFieldChange).toHaveBeenCalledWith("group_id", "group-2");
  });

  it("renders the group validation error accessibly", () => {
    render(
      <EditBrandFields
        brandGroups={brandGroups}
        disabled={false}
        errors={{ group_id: "Select a brand group" }}
        formState={{ ...formState, group_id: "" }}
        onFieldChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert").textContent).toBe("Select a brand group");
    expect(
      screen
        .getByRole("combobox", { name: "Brand group" })
        .getAttribute("aria-describedby"),
    ).toBe("group_id-error");
  });
});
