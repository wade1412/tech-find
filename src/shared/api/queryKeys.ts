export const queryKeys = {
  technicians: {
    active: ["technicians", "active"],
    all: ["technicians", "all"],
    archived: ["technicians", "archived"],
  },
  units: {
    active: ["units", "active"],
    all: ["units", "all"],
    archived: ["units", "archived"],
    detail: (id: string) => ["units", "detail", id],
  },
  specificIssues: ["specific-issues"],
  brands: {
    active: ["brands", "active"],
    all: ["brands", "all"],
    archived: ["brands", "archived"],
    detail: (id: string) => ["brands", "detail", id],
  },
  brandGroups: {
    active: ["brand-groups", "active"],
    all: ["brand-groups", "all"],
    archived: ["brand-groups", "archived"],
    detail: (id: string) => ["brand-groups", "detail", id],
  },
  technicianSkillSet: ["technician_skill_set"],
  technicianIgnoreList: ["technician_ignore_list"],
  serviceZone: ["service_zone"],
  technicianServiceZone: ["technician_service_zone"],
  users: ["users"],
} as const;
