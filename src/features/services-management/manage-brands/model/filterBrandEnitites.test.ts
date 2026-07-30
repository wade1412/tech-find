import { describe, expect, it } from "vitest";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { filterBrandGroups, filterBrands } from "./filterBrandEntities";

const makeBrand = (overrides: Partial<Brand> = {}): Brand => ({
  id: "brand-1",
  name: "Brand One",
  slug: "brand_one",
  group_id: "group-1",
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  archived_via_group_id: null,
  ...overrides,
});

const makeBrandGroup = (overrides: Partial<BrandGroup> = {}): BrandGroup => ({
  id: "group-1",
  name: "Group One",
  slug: "group_one",
  display_order: 10,
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  ...overrides,
});

const brandGroups = [
  makeBrandGroup(),
  makeBrandGroup({
    id: "group-2",
    name: "Premium Group",
    slug: "premium_group",
  }),
  makeBrandGroup({
    id: "group-3",
    name: "Inactive Group",
    slug: "inactive_group",
    active: false,
  }),
];

const brandGroupsById = new Map(brandGroups.map((group) => [group.id, group]));

const brands = [
  makeBrand(),
  makeBrand({
    id: "brand-2",
    name: "Luxury Brand",
    slug: "luxury_brand",
    group_id: "group-2",
  }),
  makeBrand({
    id: "brand-3",
    name: "Inactive Brand",
    slug: "inactive_brand",
    active: false,
  }),
];

describe("filterBrands", () => {
  it("returns all brands when no filters are applied", () => {
    const result = filterBrands({
      brands,
      brandGroupsById,
      searchTerm: "",
      status: "all",
    });

    expect(result).toEqual(brands);
  });

  it("filters brands by status", () => {
    const result = filterBrands({
      brands,
      brandGroupsById,
      searchTerm: "",
      status: "inactive",
    });

    expect(result).toEqual([brands[2]]);
  });

  it("filters brands by name or brand group name", () => {
    const byBrandName = filterBrands({
      brands,
      brandGroupsById,
      searchTerm: "luxury",
      status: "all",
    });

    const byGroupName = filterBrands({
      brands,
      brandGroupsById,
      searchTerm: "premium",
      status: "all",
    });

    expect(byBrandName).toEqual([brands[1]]);
    expect(byGroupName).toEqual([brands[1]]);
  });

  it("combines search and status filters", () => {
    const result = filterBrands({
      brands,
      brandGroupsById,
      searchTerm: "inactive",
      status: "inactive",
    });

    expect(result).toEqual([brands[2]]);
  });
});

describe("filterBrandGroups", () => {
  it("returns all groups when no filters are applied", () => {
    const result = filterBrandGroups({
      brandGroups,
      searchTerm: "",
      status: "all",
    });

    expect(result).toEqual(brandGroups);
  });

  it("filters groups by status", () => {
    const result = filterBrandGroups({
      brandGroups,
      searchTerm: "",
      status: "inactive",
    });

    expect(result).toEqual([brandGroups[2]]);
  });

  it("filters groups by name or slug", () => {
    const result = filterBrandGroups({
      brandGroups,
      searchTerm: "premium",
      status: "all",
    });

    expect(result).toEqual([brandGroups[1]]);
  });
});
