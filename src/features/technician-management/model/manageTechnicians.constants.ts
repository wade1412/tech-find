export const editTechnicianSections = [
  { id: "profile", title: "Profile & Capabilities" },
  { id: "service_zones", title: "Service Zones" },
  { id: "skills", title: "Skills" },
  { id: "ignore_list", title: "Ignore List" },
] as const;

export type EditTechnicianSectionId =
  (typeof editTechnicianSections)[number]["id"];

export const MANAGE_TECHNICIANS_LIST_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export type ManageTechniciansListFilterValue =
  (typeof MANAGE_TECHNICIANS_LIST_FILTER_OPTIONS)[number]["value"];

export const isManageTechniciansListFilterValue = (
  value: string | null,
): value is ManageTechniciansListFilterValue =>
  MANAGE_TECHNICIANS_LIST_FILTER_OPTIONS.some(
    (option) => option.value === value,
  );
