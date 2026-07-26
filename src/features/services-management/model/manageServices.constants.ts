export const editServicesSections = [
  { id: "units", title: "Units" },
  { id: "brands", title: "Brands" },
  { id: "specific_issues", title: "Specific Issues" },
  { id: "service_zones", title: "Service Zones" },
] as const;

export type EditServicesSectionId = (typeof editServicesSections)[number]["id"];
