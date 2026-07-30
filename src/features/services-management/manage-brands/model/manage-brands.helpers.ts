import type {
  Brand,
  BrandInsert,
  BrandUpdate,
} from "../../../../entities/brand/brand.types";
import type {
  BrandGroup,
  BrandGroupInsert,
  BrandGroupUpdate,
} from "../../../../entities/brandGroup/brandGroup.types";
import type {
  BrandFormState,
  BrandGroupFormState,
} from "./manage-brands.types";

export const createBrandFormState = (brand: Brand): BrandFormState => {
  return {
    active: brand.active,
    group_id: brand.group_id,
    name: brand.name,
    slug: brand.slug,
  };
};

export const EMPTY_BRAND_FORM_STATE: BrandFormState = {
  active: true,
  name: "",
  slug: "",
  group_id: "",
};

export const normalizeBrandFormState = (
  formState: BrandFormState,
): BrandInsert => ({
  active: formState.active,
  name: formState.name.trim(),
  slug: formState.slug.trim().toLowerCase(),
  group_id: formState.group_id,
});

export const buildBrandPatch = (
  brand: Brand,
  formState: BrandFormState,
): BrandUpdate => {
  const normalized = normalizeBrandFormState(formState);
  const patch: BrandUpdate = {};

  for (const key of Object.keys(normalized) as (keyof BrandInsert)[]) {
    if (normalized[key] !== brand[key]) {
      Object.assign(patch, { [key]: normalized[key] });
    }
  }

  return patch;
};

export const isNewBrandFormDirty = (formState: BrandFormState): boolean => {
  const normalized = normalizeBrandFormState(formState);
  const initial = normalizeBrandFormState(EMPTY_BRAND_FORM_STATE);

  return Object.keys(normalized).some(
    (key) =>
      normalized[key as keyof BrandInsert] !==
      initial[key as keyof BrandInsert],
  );
};

export const createBrandGroupFormState = (
  brandGroup: BrandGroup,
): BrandGroupFormState => {
  return {
    active: brandGroup.active,
    name: brandGroup.name,
    slug: brandGroup.slug,
    display_order: String(brandGroup.display_order),
  };
};

export const EMPTY_BRAND_GROUP_FORM_STATE: BrandGroupFormState = {
  active: true,
  name: "",
  slug: "",
  display_order: "10",
};

export const normalizeBrandGroupFormState = (
  formState: BrandGroupFormState,
): BrandGroupInsert => ({
  active: formState.active,
  name: formState.name.trim(),
  slug: formState.slug.trim().toLowerCase(),
  display_order: Number(formState.display_order),
});

export const buildBrandGroupPatch = (
  brandGroup: BrandGroup,
  formState: BrandGroupFormState,
): BrandGroupUpdate => {
  const normalized = normalizeBrandGroupFormState(formState);
  const patch: BrandGroupUpdate = {};

  for (const key of Object.keys(normalized) as (keyof BrandGroupInsert)[]) {
    if (normalized[key] !== brandGroup[key]) {
      Object.assign(patch, { [key]: normalized[key] });
    }
  }

  return patch;
};

export const isNewBrandGroupFormDirty = (
  formState: BrandGroupFormState,
): boolean => {
  const normalized = normalizeBrandGroupFormState(formState);
  const initial = normalizeBrandGroupFormState(EMPTY_BRAND_GROUP_FORM_STATE);

  return Object.keys(normalized).some(
    (key) =>
      normalized[key as keyof BrandGroupInsert] !==
      initial[key as keyof BrandGroupInsert],
  );
};
