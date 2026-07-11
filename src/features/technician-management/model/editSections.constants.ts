export const editSections = [
  { id: "profile", title: "Profile & Capabilities" },
  { id: "service_zones", title: "Service Zones" },
  { id: "skills", title: "Skills" },
  { id: "ignore_list", title: "Ignore List" },
] as const;

export type EditSectionId = (typeof editSections)[number]["id"];
