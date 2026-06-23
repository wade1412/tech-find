import type { Technician } from "../../../entities/technician/technician.types";

export const buildTechnicianPatch = (
  technician: Technician,
  draft: Technician,
): Partial<Technician> => {
  const patch: Record<string, unknown> = {};
  const keys = Object.keys(technician) as Array<keyof Technician>;

  for (const key of keys) {
    const techKey = key as keyof Technician;

    if (draft[techKey] !== technician[key]) {
      patch[techKey] = draft[techKey];
    }
  }

  return patch;
};
