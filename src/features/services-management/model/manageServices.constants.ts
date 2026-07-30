export const editServicesSections = [
  { id: "units", title: "Units" },
  { id: "brands", title: "Brands" },
  { id: "specific_issues", title: "Specific Issues" },
  { id: "service_zones", title: "Service Zones" },
] as const;

export type EditServicesSectionId = (typeof editServicesSections)[number]["id"];

export const DEFAULT_SECTION_ID: EditServicesSectionId = "units";

const editServiceSectionIds = new Set<EditServicesSectionId>(
  editServicesSections.map((s) => s.id),
);

export const isEditServicesSectionId = (
  value: string | null,
): value is EditServicesSectionId =>
  value !== null && editServiceSectionIds.has(value as EditServicesSectionId);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
