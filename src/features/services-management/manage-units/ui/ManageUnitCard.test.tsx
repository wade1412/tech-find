import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { Unit } from "../../../../entities/unit/unit.types";
import ManageUnitCard from "./ManageUnitCard";

const unit: Unit = {
  active: false,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_commercial: true,
  can_be_gas: true,
  can_be_stacked: false,
  display_order: 20,
  id: "unit-1",
  is_built_in: false,
  name: "Dryer",
  slug: "dryer",
};

describe("ManageUnitCard", () => {
  it("renders management metadata and the inactive state", () => {
    render(
      <MemoryRouter>
        <ManageUnitCard unit={unit} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /Dryer/i });

    expect(link.getAttribute("href")).toBe("/units/unit-1/edit");
    expect(screen.getByText("Filter order 20")).toBeTruthy();
    expect(screen.getByText("Commercial · Gas")).toBeTruthy();
    expect(screen.getByText("Inactive")).toBeTruthy();
  });
});
