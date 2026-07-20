export const queryKeys = {
  technicians: {
    active: ["technicians", "active"],
    all: ["technicians", "all"],
    archived: ["technicians", "archived"],
  },
  units: ["units"],
  specificIssues: ["specific-issues"],
  brands: ["brands"],
  brandGroups: ["brand_groups"],
  technicianSkillSet: ["technician_skill_set"],
  technicianIgnoreList: ["technician_ignore_list"],
  serviceZone: ["service_zone"],
  technicianServiceZone: ["technician_service_zone"],
  users: ["users"],
} as const;
