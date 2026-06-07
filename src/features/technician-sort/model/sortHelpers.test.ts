import { describe, expect, it } from "vitest";
import { parseStringToSortTuple } from "./sortHelpers";

describe("parseStringToSortTuple", () => {
  it("parses valid string", () => {
    expect(parseStringToSortTuple("alias.desc")).toEqual(["alias", "desc"]);
  });

  it("falls back to default field for invalid field", () => {
    expect(parseStringToSortTuple("invalid.desc")).toEqual(["default", "desc"]);
  });

  it("falls back to asc for invalid direction", () => {
    expect(parseStringToSortTuple("alias.invalide")).toEqual(["alias", "asc"]);
  });

  it("falls back to default asc for empty string", () => {
    expect(parseStringToSortTuple("")).toEqual(["default", "asc"]);
  });
});
