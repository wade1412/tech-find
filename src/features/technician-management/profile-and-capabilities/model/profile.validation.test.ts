import { describe, it, expect } from "vitest";
import { validateProfileForm } from "./profile.validation";
import type { TechnicianFormState } from "./profile.types";

const validFormState: TechnicianFormState = {
  name: "Default Name",
  alias: "Default Alias",
  notes: "",
  active: true,
  jobs_per_day: "2-3",
  home_zip_code: "28100",
  gas: false,
  commercial: false,
  can_service_built_in: false,
  can_service_stacked_washer: false,
  can_service_stacked_dryer: false,
};

describe("validateProfileForm", () => {
  it("returns null values on valid fields", () => {
    expect(validateProfileForm(validFormState)).toEqual({
      alias: null,
      name: null,
      home_zip_code: null,
      jobs_per_day: null,
      notes: null,
    });
  });

  it("returns error on empty alias or name", () => {
    const errorObj = validateProfileForm({
      ...validFormState,
      name: "",
      alias: "",
    });

    expect([errorObj.alias, errorObj.name]).toEqual([
      "Alias cannot be empty",
      "Name cannot be empty",
    ]);
  });

  it("validates aliases and names with special characters", () => {
    const formValidation = validateProfileForm({
      ...validFormState,
      alias: "Jay-Jay",
      name: "James O'Neil",
    });

    expect(Object.values(formValidation).filter((v) => v !== null)).toEqual([]);
  });

  it("allows a period in a technician name abbreviation", () => {
    const formValidation = validateProfileForm({
      ...validFormState,
      name: "Harry H.",
    });

    expect(formValidation.name).toBeNull();
  });

  it("does not extend period support to aliases", () => {
    const formValidation = validateProfileForm({
      ...validFormState,
      alias: "H.",
    });

    expect(formValidation.alias).toBe(
      "Alias cannot contain numbers or special characters",
    );
  });

  it("returns error on invalid or empty alias or name", () => {
    const invalidFrom = {
      ...validFormState,
      alias: "```-*",
      name: "Technician's Name 444",
    };

    const errorObj = validateProfileForm(invalidFrom);

    expect(errorObj.alias).toBe(
      "Alias cannot contain numbers or special characters",
    );

    expect(errorObj.name).toBe(
      "Name cannot contain numbers or special characters",
    );
  });

  it("requires a name value to be not longer than 24 characters", () => {
    const validFormName = {
      ...validFormState,
      name: "a".repeat(24),
    };
    const invalidFormName = {
      ...validFormState,
      name: "a".repeat(25),
    };

    const validatedCorrectName = validateProfileForm(validFormName);
    const validatedIncorrectName = validateProfileForm(invalidFormName);

    expect(
      Object.values(validatedCorrectName).filter((v) => v !== null),
    ).toEqual([]);
    expect(validatedIncorrectName.name).toBe(
      "Name cannot be longer than 24 characters",
    );
  });

  it("validates zip codes that start with 0", () => {
    const zipCodeValidation = validateProfileForm({
      ...validFormState,
      home_zip_code: "01234",
    });

    expect(Object.values(zipCodeValidation).filter((v) => v !== null)).toEqual(
      [],
    );
  });

  it("validates zip codes that have whitespaces", () => {
    const zipCodeValidation = validateProfileForm({
      ...validFormState,
      home_zip_code: "                  01234          ",
    });

    expect(Object.values(zipCodeValidation).filter((v) => v !== null)).toEqual(
      [],
    );
  });

  it("returns error on invalid zip codes", () => {
    const lengthyZipError = validateProfileForm({
      ...validFormState,
      home_zip_code: "0123444",
    });
    const shortZipError = validateProfileForm({
      ...validFormState,
      home_zip_code: "2222",
    });
    const invalidZipError = validateProfileForm({
      ...validFormState,
      home_zip_code: "zipco",
    });

    expect(lengthyZipError.home_zip_code).toBe(
      "ZIP code must contain exactly 5 digits",
    );
    expect(shortZipError.home_zip_code).toBe(
      "ZIP code must contain exactly 5 digits",
    );
    expect(invalidZipError.home_zip_code).toBe(
      "ZIP code must contain numbers only",
    );
  });

  it("requires specific jobs per day range format", () => {
    const oneJobValidation = validateProfileForm({
      ...validFormState,
      jobs_per_day: "1",
    });
    const nineJobValidation = validateProfileForm({
      ...validFormState,
      jobs_per_day: "9",
    });
    const oneJobRangeValidation = validateProfileForm({
      ...validFormState,
      jobs_per_day: "1-1",
    });
    const regularJobRangeValidation = validateProfileForm({
      ...validFormState,
      jobs_per_day: "1-9",
    });

    expect(
      [
        ...Object.values(oneJobValidation),
        ...Object.values(oneJobRangeValidation),
        ...Object.values(nineJobValidation),
        ...Object.values(regularJobRangeValidation),
      ].filter((v) => v !== null),
    ).toEqual([]);
  });

  it("returns error on empty jobs range", () => {
    const emptyJobsRangeError = validateProfileForm({
      ...validFormState,
      jobs_per_day: "",
    });

    expect(emptyJobsRangeError.jobs_per_day).toBe(
      "Jobs range has invalid format",
    );
  });

  it("returns error on invalid jobs range format", () => {
    const zeroJobRangeError = validateProfileForm({
      ...validFormState,
      jobs_per_day: "0",
    });
    const tenJobRangeError = validateProfileForm({
      ...validFormState,
      jobs_per_day: "10",
    });
    const invalidJobRangeError = validateProfileForm({
      ...validFormState,
      jobs_per_day: "9-1",
    });

    expect([
      zeroJobRangeError.jobs_per_day,
      tenJobRangeError.jobs_per_day,
      invalidJobRangeError.jobs_per_day,
    ]).toEqual([
      "Jobs range has invalid format",
      "Jobs range has invalid format",
      "Jobs range has invalid format",
    ]);
  });

  it("requires notes to be not longer than 300 characters", () => {
    const validNotesValidation = validateProfileForm({
      ...validFormState,
      notes: "a".repeat(300),
    });

    const invalidNotesError = validateProfileForm({
      ...validFormState,
      notes: "a".repeat(301),
    });

    expect(
      Object.values(validNotesValidation).filter((v) => v !== null),
    ).toEqual([]);

    expect(invalidNotesError.notes).toBe(
      "Notes cannot be longer than 300 characters",
    );
  });

  it("returns multiple errors on multiple invalid inputs", () => {
    const invalidFormError = validateProfileForm({
      ...validFormState,
      alias: "Alex 1995",
      name: "",
      home_zip_code: "3333333333",
      jobs_per_day: "three",
    });

    expect([
      invalidFormError.alias,
      invalidFormError.name,
      invalidFormError.home_zip_code,
      invalidFormError.jobs_per_day,
    ]).toEqual([
      "Alias cannot contain numbers or special characters",
      "Name cannot be empty",
      "ZIP code must contain exactly 5 digits",
      "Jobs range has invalid format",
    ]);
  });
});
