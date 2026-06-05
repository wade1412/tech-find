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
  sort: string;
  zone: string;
};

export type JobOptionKey = "gas" | "stacked" | "commercial";

export interface FilterTechniciansParams {
  filter: FilterState;
  technicians: Technician[];
  skillsByTechId: Map<string, TechnicianSkill[]>;
  selectedUnits: Unit[];
  selectedUnitIds: Set<string>;
  selectedBrandIds: Set<string>;
  selectedBrandGroupIds: Set<string>;
  selectedIssueIds: Set<string>;
  selectedIssueIdsByUnitId: Map<string, Set<string>>;
  ignoreListsByTechId: Map<string, TechnicianIgnoreList[]>;
}
