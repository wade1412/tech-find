import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useTechnicianIgnoreListQuery } from "../../../entities/technician-ignore-list/technicianIgnoreListQuery";
import { useTechnicianSkillSetQuery } from "../../../entities/technician-skill-set/technicianSkillSetQuery";
import { useTechniciansQuery } from "../../../entities/technician/useTechniciansQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";

const useFilteredTechnicians = () => {
  const { data: technicians, isError: techniciansError } =
    useTechniciansQuery();
  const { data: units, isError: unitsError } = useUnitsQuery();
  const { data: brands, isError: brandsError } = useBrandsQuery();
  const { data: specificIssues, isError: specificIssuesError } =
    useBrandsQuery();
  const { data: techniciansSkills, isError: technicianSkillsError } =
    useTechnicianSkillSetQuery();
  const { data: techniciansIgnore, isError: techniciansIgnoreError } =
    useTechnicianIgnoreListQuery();

  const isError =
    techniciansError ||
    unitsError ||
    brandsError ||
    specificIssuesError ||
    technicianSkillsError ||
    techniciansIgnoreError;

  if (isError) return;
};
