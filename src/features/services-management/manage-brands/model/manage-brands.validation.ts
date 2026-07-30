import { SLUG_PATTERN } from "../../model/manageServices.constants";
import type {
  BrandFormErrors,
  BrandFormState,
  BrandGroupFormErrors,
  BrandGroupFormState,
} from "./manage-brands.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";

export const validateBrandForm = (
  formState: BrandFormState,
  brandGroups: readonly BrandGroup[],
): BrandFormErrors => {
  const name = formState.name.trim();
  const slug = formState.slug.trim().toLowerCase();
  const selectedGroup = brandGroups.find(
    (brandGroup) => brandGroup.id === formState.group_id,
  );

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
    group_id: !formState.group_id
      ? "Select a brand group"
      : !selectedGroup
        ? "The selected brand group is no longer available"
        : selectedGroup.archived_at
          ? "Archived brand groups cannot be selected"
          : undefined,
  };
};

type DatabaseError = Error & {
  code?: string;
  constraint?: string;
  details?: string;
};

export const getBrandSaveErrorMessage = (error: Error | null) => {
  if (!error) return undefined;

  const databaseError = error as DatabaseError;
  if (databaseError.code !== "23505") return error.message;

  const constraintText =
    `${databaseError.constraint ?? ""} ${databaseError.details ?? ""}`.toLowerCase();

  if (
    constraintText.includes("brand_name") ||
    constraintText.includes("key (name)")
  ) {
    return "A brand with this name already exists.";
  }

  if (
    constraintText.includes("brand_slug") ||
    constraintText.includes("key (slug)")
  ) {
    return "A brand with this slug already exists.";
  }

  return "A brand with this name or slug already exists.";
};

export const validateBrandGroupForm = (
  formState: BrandGroupFormState,
): BrandGroupFormErrors => {
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
