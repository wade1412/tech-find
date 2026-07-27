import { describe, expect, it } from "vitest";
import type { Unit } from "../../../../entities/unit/unit.types";
import { filterUnits } from "./filterUnits";

const makeUnit = (overrides: Partial<Unit> = {}): Unit => ({
  active: true,
  can_be_commercial: false,
  can_be_gas: false,
  can_be_stacked: false,
  display_order: 10,
  id: "unit-1",
  is_built_in: false,
  name: "Washer",
  slug: "washer",
  ...overrides,
});

const units = [
  makeUnit(),
  makeUnit({
    can_be_gas: true,
    display_order: 20,
    id: "unit-2",
    name: "Stacked Dryer",
    slug: "stacked-dryer",
  }),
];

describe("filterUnits", () => {
  it("returns all units for an empty search", () => {
    expect(
      filterUnits({ units, searchTerm: "   ", status: "all" }),
    ).toEqual(units);
  });

  it("matches multiple normalized terms across name and slug", () => {
    expect(
      filterUnits({
        units,
        searchTerm: "DRYER stacked",
        status: "all",
      }).map(({ id }) => id),
    ).toEqual(["unit-2"]);
  });

  it("matches display order and capabilities", () => {
    expect(
      filterUnits({
        units,
        searchTerm: "20 gas",
        status: "all",
      }).map(({ id }) => id),
    ).toEqual(["unit-2"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterUnits({
        units,
        searchTerm: "refrigerator",
        status: "all",
      }),
    ).toEqual([]);
  });

  it("filters units by active status before applying search", () => {
    const unitsWithInactive = [
      ...units,
      makeUnit({
        active: false,
        id: "unit-3",
        name: "Inactive Washer",
      }),
    ];

    expect(
      filterUnits({
        units: unitsWithInactive,
        searchTerm: "washer",
        status: "inactive",
      }).map(({ id }) => id),
    ).toEqual(["unit-3"]);
  });
});
