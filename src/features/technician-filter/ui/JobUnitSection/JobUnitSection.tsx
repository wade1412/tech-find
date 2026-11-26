import { useTechnicianFilters } from "../../model/useTechnicianFilters";
import JobOptions from "./JobOptions";
import UnitSelector from "./UnitSelector";

function JobUnitSection() {
  const {
    filter,
    toggleUnit,
    clearUnits,
    toggleGas,
    toggleStacked,
    toggleInstallation,
    toggleCommercial,
    clearOptionByKeys,
  } = useTechnicianFilters();

  return (
    <div className="flex flex-col gap-2">
      <JobOptions
        filter={filter}
        toggleGas={toggleGas}
        toggleStacked={toggleStacked}
        toggleCommercial={toggleCommercial}
        toggleInstallation={toggleInstallation}
        clearOptionByKeys={clearOptionByKeys}
      />

      <UnitSelector
        filter={filter}
        toggleUnit={toggleUnit}
        clearUnits={clearUnits}
      />
    </div>
  );
}

export default JobUnitSection;
