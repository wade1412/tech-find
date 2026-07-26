import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";

interface ManageServiceZonesSectionProps {
  zones: ServiceZone[];
}
function ManageServiceZonesSection({ zones }: ManageServiceZonesSectionProps) {
  return <div>ManageServiceZonesSection: {zones.length}</div>;
}

export default ManageServiceZonesSection;
