import type {
  ServiceZone,
  ServiceZoneInsert,
  ServiceZoneUpdate,
} from "../../../../entities/service-zone/service-zone.types";
import type { ZoneFormState } from "./manage-zones.types";

export const createZoneFormState = (zone: ServiceZone): ZoneFormState => {
  return {
    active: zone.active,
    display_order: String(zone.display_order),
    name: zone.name,
    slug: zone.slug,
  };
};

export const EMPTY_ZONE_FORM_STATE: ZoneFormState = {
  active: true,
  display_order: "10",
  name: "",
  slug: "",
};

export const normalizeZoneFormState = (
  formState: ZoneFormState,
): ServiceZoneInsert => ({
  active: formState.active,

  display_order: Number(formState.display_order),

  name: formState.name.trim(),
  slug: formState.slug.trim().toLowerCase(),
});

export const buildZonePatch = (
  zone: ServiceZone,
  formState: ZoneFormState,
): ServiceZoneUpdate => {
  const normalized = normalizeZoneFormState(formState);
  const patch: ServiceZoneUpdate = {};

  for (const key of Object.keys(normalized) as (keyof ServiceZoneInsert)[]) {
    if (normalized[key] !== zone[key]) {
      Object.assign(patch, { [key]: normalized[key] });
    }
  }

  return patch;
};

export const isNewZoneFormDirty = (formState: ZoneFormState): boolean => {
  const normalized = normalizeZoneFormState(formState);
  const initial = normalizeZoneFormState(EMPTY_ZONE_FORM_STATE);

  return Object.keys(normalized).some(
    (key) =>
      normalized[key as keyof ServiceZoneInsert] !==
      initial[key as keyof ServiceZoneInsert],
  );
};
