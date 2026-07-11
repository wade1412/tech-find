import { useServiceZonesQuery } from "../../../../entities/service-zone/useServiceZonesQuery";
import { useTechnicianServiceZonesQuery } from "../../../../entities/technician-service-zone/useTechnicianServiceZonesQuery";
import type { Technician } from "../../../../entities/technician/technician.types";
import ErrorMessage from "../../../../shared/ui/ErrorMessage";
import ManagementSectionSkeleton from "../../ui/ManagementSectionSkeleton";
import ServiceZonesForm from "./ServiceZonesForm";

interface ServiceZonesSectionProps {
  technician: Technician;
}

function ServiceZonesSection({ technician }: ServiceZonesSectionProps) {
  const {
    data: technicianZones,
    isPending: isTechnicianZonesPending,
    isError: isTechnicianZonesError,
    error: technicianZonesErrorObj,
  } = useTechnicianServiceZonesQuery();
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesErrorObject,
  } = useServiceZonesQuery();

  if (isTechnicianZonesPending || isZonesPending) {
    return <ManagementSectionSkeleton variant="serviceZones" />;
  }
  if (isTechnicianZonesError || isZonesError) {
    return (
      <ErrorMessage
        message={technicianZonesErrorObj?.message ?? zonesErrorObject?.message}
      />
    );
  }

  const initialZoneIds = technicianZones.flatMap((techZone) =>
    techZone.technician_id === technician.id ? [techZone.zone_id] : [],
  );

  return (
    <ServiceZonesForm
      technicianId={technician.id}
      zones={zones}
      initialZoneIds={initialZoneIds}
    />
  );
}

export default ServiceZonesSection;
