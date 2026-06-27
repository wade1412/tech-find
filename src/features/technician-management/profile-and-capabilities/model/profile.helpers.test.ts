import { describe, it, expect } from "vitest";
import {
  buildTechnicianPatch,
  createTechnicianFormState,
} from "./profile.helpers";
import { makeTechnician } from "../../../technician-filter/model/filterTestFixtures";
import { EDITABLE_KEYS } from "./profile.constants";

describe("createTechnicianFormState", () => {
  it("takes only editable keys", () => {
    const technician = makeTechnician();

    const draft = createTechnicianFormState(technician);

    expect(Object.keys(draft)).toEqual(EDITABLE_KEYS);
  });

  it("converts null notes to empty string", () => {
    const technician = makeTechnician({ notes: null });

    const draft = createTechnicianFormState(technician);

    expect(draft.notes).toEqual("");
  });
});

describe("buildTechnicianPatch", () => {
  it("returns empty object on unchanged draft", () => {
    const technician = makeTechnician({ alias: "tech-one" });

    const draft = createTechnicianFormState(technician);

    expect(buildTechnicianPatch(technician, draft)).toEqual({});
  });

  it("returns empty object on null notes", () => {
    const technician = makeTechnician({ notes: null });

    const draft = createTechnicianFormState(technician);

    expect(buildTechnicianPatch(technician, draft)).toEqual({});
  });

  it("returns an empty patch when changes are reverted", () => {
    const technician = makeTechnician({ alias: "tech-one" });

    const initialDraft = createTechnicianFormState(technician);
    const changedDraft = { ...initialDraft, alias: "tech-two" };
    const revertedDraft = { ...changedDraft, alias: "tech-one" };

    expect(
      Object.entries(buildTechnicianPatch(technician, changedDraft)),
    ).toEqual([["alias", "tech-two"]]);
    expect(
      Object.keys(buildTechnicianPatch(technician, revertedDraft)).length,
    ).toBe(0);
  });

  it("returns null value in patch on empty notes", () => {
    const technician = makeTechnician({
      alias: "tech-one",
      notes: "test notes",
    });

    const draft = createTechnicianFormState({ ...technician, notes: "     " });

    expect(buildTechnicianPatch(technician, draft)).toEqual({
      notes: null,
    });
  });

  it("returns only changed values in patch", () => {
    const technician = makeTechnician({
      alias: "Bob",
      name: "Robert",
      notes: "Works fast",
      home_zip_code: "29144",
    });

    const draft = createTechnicianFormState({
      ...technician,
      alias: "Kent",
      notes: "Works fast",
      home_zip_code: "29000",
    });

    expect(buildTechnicianPatch(technician, draft)).toEqual({
      alias: "Kent",
      home_zip_code: "29000",
    });
  });

  it("returns boolean changes in the patch", () => {
    const technician = makeTechnician({
      alias: "tech-one",
      gas: false,
      commercial: true,
    });

    const draft = {
      ...createTechnicianFormState(technician),
      gas: true,
      commercial: false,
    };

    expect(buildTechnicianPatch(technician, draft)).toEqual({
      gas: true,
      commercial: false,
    });
  });

  it("ignores whitespaces during matching", () => {
    const technician = makeTechnician({
      alias: " Bob    ",
    });

    const draft = {
      ...createTechnicianFormState(technician),
      alias: "      Bob",
    };

    expect(Object.keys(buildTechnicianPatch(technician, draft)).length).toEqual(
      0,
    );
  });
});
