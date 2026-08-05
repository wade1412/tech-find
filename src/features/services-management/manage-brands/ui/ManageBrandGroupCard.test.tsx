import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import ManageBrandGroupCard from "./ManageBrandGroupCard";

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

describe("ManageBrandGroupCard", () => {
  it("communicates hierarchy metadata and uses the group edit route", () => {
    render(
      <MemoryRouter>
        <ManageBrandGroupCard brandGroup={brandGroup} brandCount={6} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /High End/i });

    expect(link.getAttribute("href")).toBe(
      "/brand-groups/group-1/edit",
    );
    expect(screen.getByText("Brand group")).toBeTruthy();
    expect(screen.getByText("6 brands · Order 20")).toBeTruthy();
  });
});
