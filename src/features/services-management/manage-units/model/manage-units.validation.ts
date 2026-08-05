import { SLUG_PATTERN } from "../../model/manageServices.constants";
import type { UnitFormErrors, UnitFormState } from "./manage-units.types";

export const validateUnitForm = (formState: UnitFormState): UnitFormErrors => {
  const name = formState.name.trim();
  const slug = formState.slug.trim().toLowerCase();
  const displayOrder = Number(formState.display_order);

  return {
    name: !name
      ? "Name cannot be empty"
      : name.length > 80
        ? "Name cannot be longer than 80 characters"
        : undefined,
    slug: !slug
      ? "Slug cannot be empty"
      : slug.length > 64
        ? "Slug cannot be longer than 64 characters"
        : !SLUG_PATTERN.test(slug)
          ? "Use lowercase letters, numbers, and single hyphens"
          : undefined,
    display_order:
      formState.display_order.trim() === ""
        ? "Display order cannot be empty"
        : !Number.isInteger(displayOrder) ||
            displayOrder < 0 ||
            displayOrder > 9999
          ? "Display order must be a whole number from 0 to 9999"
          : undefined,
  };
};
