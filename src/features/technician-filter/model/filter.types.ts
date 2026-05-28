import type { TechnicianIgnoreList } from "../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { TechnicianSkill } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";
import type { Unit } from "../../../entities/unit/unit.types";

export type FilterState = {
  unitSlugs: string[];
  brandSlugs: string[];
  specificIssueSlugs: string[];
  isGas: boolean;
  isCommercial: boolean;
  isStacked: boolean;
};

export type JobOptionKey = "gas" | "stacked" | "commercial";

export interface FilterTechniciansParams {
  filter: FilterState;
  technicians: Technician[];
  skills: TechnicianSkill[];
  selectedUnits: Unit[];
  selectedUnitIds: Set<string>;
  selectedBrandIds: Set<string>;
  selectedBrandGroupIds: Set<string>;
  selectedIssueIds: Set<string>;
  selectedIssueIdsByUnitId: Map<string, Set<string>>;
  ignoreLists: TechnicianIgnoreList[];
}
