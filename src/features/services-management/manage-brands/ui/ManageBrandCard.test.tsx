import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import ManageBrandCard from "./ManageBrandCard";

const brand: Brand = {
  active: false,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  archived_via_group_id: null,
  group_id: "group-1",
  id: "brand-1",
  name: "KitchenAid",
  slug: "kitchenaid",
};

const brandGroup: BrandGroup = {
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  display_order: 20,
  id: "group-1",
  name: "High End",
  slug: "high-end",
};

describe("ManageBrandCard", () => {
  it("renders brand identity, group, status, and edit route", () => {
    render(
      <MemoryRouter>
        <ManageBrandCard brand={brand} brandGroup={brandGroup} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /KitchenAid/i });

    expect(link.getAttribute("href")).toBe("/brands/brand-1/edit");
    expect(screen.getByText(/kitchenaid/)).toBeTruthy();
    expect(screen.getByText(/High End/)).toBeTruthy();
    expect(screen.getByText("Inactive")).toBeTruthy();
  });

  it("shows when an otherwise active brand belongs to an inactive group", () => {
    render(
      <MemoryRouter>
        <ManageBrandCard
          brand={{ ...brand, active: true }}
          brandGroup={{ ...brandGroup, active: false }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Group inactive")).toBeTruthy();
  });
});
