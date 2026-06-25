import { describe, it, expect } from "vitest";
import { makeTechnician } from "../../technician-filter/model/filterTestFixtures";
import { filterTechniciansBySearch } from "./filterTechniciansBySearch";

const getIds = (technicians: { id: string }[]) =>
  technicians.map((technician) => technician.id);

describe("filterTechniciansBySearch", () => {
  it("returns all technicians on empty query", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Tech One",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Tech Two",
      }),
    ];
    const searchTerm = "";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["Center", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-1", "tech-2"]);
  });

  it("returns all technicians on empty spaces query", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Tech One",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Tech Two",
      }),
    ];
    const searchTerm = "         ";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["Center", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-1", "tech-2"]);
  });

  it("returns matching tecnicians alias on both uppercase and lowercase queries", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "BRIAN",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "brian",
      }),
    ];

    const searchTerm = "ria";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["Center", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-1", "tech-2"]);
  });

  it("returns matching tecnicians name on both uppercase and lowercase queries", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Tech One",
        name: "Vasiliy",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Tech Two",
        name: "VASILIY",
      }),
    ];

    const searchTerm = "sil";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["Center", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-1", "tech-2"]);
  });

  it("returns matching technician's zip", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Tech One",
        home_zip_code: "28110",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Tech Two",
        home_zip_code: "28056",
      }),
    ];

    const searchTerm = "28110";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["Center", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-1"]);
  });

  it("returns technicians with matching zone names", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Tech One",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Tech Two",
      }),
    ];

    const searchTerm = "North";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["Center", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-1"]);
  });

  it("returns technician that matches both query words", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Bob",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Michael",
      }),
    ];

    const searchTerm = "Michael North";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["North", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual(["tech-2"]);
  });

  it("return an empty array if no technicians match the search term", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Bob",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Michael",
      }),
    ];

    const searchTerm = "Michael East";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["North", "West"]],
    ]);

    expect(
      getIds(
        filterTechniciansBySearch(
          technicians,
          searchTerm,
          zoneNamesByTechnicianId,
        ),
      ),
    ).toEqual([]);
  });

  it("does not mutate technicians array", () => {
    const technicians = [
      makeTechnician({
        id: "tech-1",
        alias: "Bob",
      }),
      makeTechnician({
        id: "tech-2",
        alias: "Michael",
      }),
    ];

    const initialIds = getIds(technicians);

    const searchTerm = "North";

    const zoneNamesByTechnicianId = new Map([
      ["tech-1", ["North", "South"]],
      ["tech-2", ["North", "West"]],
    ]);

    filterTechniciansBySearch(technicians, searchTerm, zoneNamesByTechnicianId);

    expect(getIds(technicians)).toEqual(initialIds);
  });
});
