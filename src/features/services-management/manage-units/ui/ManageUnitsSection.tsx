import type { Unit } from "../../../../entities/unit/unit.types";

interface ManageUnitsSectionProps {
  units: Unit[];
}

function ManageUnitsSection({ units }: ManageUnitsSectionProps) {
  return <div>ManageUnitsSections: {units.length}</div>;
}

export default ManageUnitsSection;
