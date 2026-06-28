import { useServiceZonesQuery } from "../../../../entities/service-zone/useServiceZonesQuery";
import { useTechnicianServiceZonesQuery } from "../../../../entities/technician-service-zone/useTechnicianServiceZonesQuery";
import type { Technician } from "../../../../entities/technician/technician.types";
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
    return <div>loading</div>;
  }
  if (isTechnicianZonesError || isZonesError) {
    return <div>{(technicianZonesErrorObj ?? zonesErrorObject)?.message}</div>;
  }

  const initialZoneIds = technicianZones.flatMap((techZone) =>
    techZone.technician_id === technician.id ? [techZone.zone_id] : [],
  );

  return <ServiceZonesForm zones={zones} initialZoneIds={initialZoneIds} />;
}

export default ServiceZonesSection;
