import { describe, expect, it } from "vitest";
import type { Technician } from "../../../entities/technician/technician.types";
import { sortTechnicians } from "./sortTechnicians";

// Helper: generate test technician
const makeTechnician = (overrides: Partial<Technician> = {}): Technician => ({
  id: "tech-1",
  name: "Default Name",
  alias: "Default Alias",
  notes: null,
  active: true,
  jobs_per_day: "Test-jobs",
  home_zip_code: "Test-zip",
  service_area: "Test-area",
  gas: false,
  commercial: false,
  can_service_built_in: false,
  can_service_stacked_washer: false,
  can_service_stacked_dryer: false,
  ...overrides,
});

describe("sortTechnicians", () => {
  it("sorts technicians by alias ascending", () => {
    const technicians = [
      makeTechnician({ id: "tech-1", alias: "Bill" }),
      makeTechnician({ id: "tech-2", alias: "Bill" }),
    ];

    const result = sortTechnicians(technicians, {
      sortMode: "alias",
      sortDirection: "asc",
    });

    expect(result.map((tech) => tech.id)).toEqual(["tech-1", "tech-2"]);
  });

  it("sorts technicians by alias descending", () => {
    const technicians = [
      makeTechnician({ id: "tech-1", alias: "Alex" }),
      makeTechnician({ id: "tech-2", alias: "Bill" }),
    ];

    const result = sortTechnicians(technicians, {
      sortMode: "alias",
      sortDirection: "desc",
    });

    expect(result.map((tech) => tech.id)).toEqual(["tech-2", "tech-1"]);
  });

  it("does not mutate original array", () => {
    const technicians = [
      makeTechnician({ id: "tech-2", alias: "Bill" }),
      makeTechnician({ id: "tech-1", alias: "Alex" }),
    ];

    const originalOrder = technicians.map((tech) => tech.id);

    sortTechnicians(technicians, {
      sortMode: "alias",
      sortDirection: "desc",
    });

    expect(technicians.map((tech) => tech.id)).toEqual(originalOrder);
  });
});
