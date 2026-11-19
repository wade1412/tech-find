import type { Unit } from "../unit.types";

export const makeUnit = (overrides: Partial<Unit> = {}): Unit => ({
  active: true,
  display_order: 10,
  id: "unit-1",
  name: "Washer",
  slug: "washer",
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_gas: false,
  can_be_stacked: false,
  can_be_installed: false,
  is_built_in: false,
  can_be_commercial: false,
  ...overrides,
});
