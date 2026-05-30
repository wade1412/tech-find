import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { useTechnicianSkillSetQuery } from "../../../entities/technician-skill-set/technicianSkillSetQuery";
import { useTechniciansQuery } from "../../../entities/technician/useTechniciansQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";

const SPECIAL_UNIT_SLUGS = new Set([
  "dryer-vent-line",
  "ice-maker-standalone",
  "vent-hood",
  "microwave",
  "water-heater",
]);

const SPECIAL_ISSUE_SLUGS = new Set(["compressor-repair", "freon-recharge"]);

export const useTechnicianSkillBadges = () => {
  const {
    data: technicians,
    isPending: isTechniciansPending,
    isError: techniciansError,
    error: techniciansErrorObject,
  } = useTechniciansQuery();
  const {
    data: units,
    isPending: isUnitsPending,
    isError: unitsError,
    error: unitsErrorObject,
  } = useUnitsQuery();
  const {
    data: specificIssues,
    isPending: isIssuesPending,
    isError: specificIssuesError,
    error: specificIssuesErrorObject,
  } = useSpecificIssuesQuery();
  const {
    data: skills,
    isPending: isSkillsPending,
    isError: skillsError,
    error: skillsErrorObject,
  } = useTechnicianSkillSetQuery();

  const isPending =
    isTechniciansPending ||
    isUnitsPending ||
    isIssuesPending ||
    isSkillsPending;

  const isError =
    techniciansError || unitsError || specificIssuesError || skillsError;

  const error =
    techniciansErrorObject ??
    unitsErrorObject ??
    specificIssuesErrorObject ??
    skillsErrorObject;

  const skillBadgesMap; // Map techId - badges

  const specificSkillsBooleans = [
    technician.gas && "Gas",
    technician.can_service_built_in && "Built-In",
    technician.can_service_stacked_dryer && "Stacked Dryer",
    technician.can_service_stacked_washer && "Stacked Washer",
    technician.commercial && "Commercial",
  ].filter(Boolean) as string[];

  return {
    skillBadges,
    isPending,
    isError,
    error,
  };
};
