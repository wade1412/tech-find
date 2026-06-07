import { describe, expect, it } from "vitest";
import { sortTechnicians } from "./sortTechnicians";
import { makeTechnician } from "../../technician-filter/model/filterTestFixtures";

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
